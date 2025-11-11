import React, { useState, useEffect, useContext } from 'react';
import { Container, Row, Col, Card, Button, Table, Modal, Form, Alert, Badge, Spinner } from 'react-bootstrap';
import { AuthContext } from '../../context/AuthContext';
import API from '../../services/api';

const RecipeList = () => {
  const { auth } = useContext(AuthContext);
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingRecipe, setEditingRecipe] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    category: '',
    image: '',
    ingredients: '',
    preparationTime: '30 min',
    isAvailable: true
  });

  const categories = [
    'Appetizers', 'Main Course', 'Desserts', 'Beverages', 
    'Salads', 'Soups', 'Breads', 'Rice & Noodles', 
    'Seafood', 'Vegetarian', 'Non-Vegetarian', 'Specials'
  ];

  // Load recipes on component mount
  useEffect(() => {
    fetchRecipes();
  }, []);

  const fetchRecipes = async () => {
    try {
      setLoading(true);
      setError('');
      console.log('🔄 Fetching recipes...');
      
      const response = await API.get('/api/recipes/my-recipes');
      console.log('📦 Recipes response:', response.data);
      
      if (response.data && response.data.success) {
        setRecipes(response.data.recipes || []);
      } else {
        throw new Error(response.data?.message || 'Failed to load recipes');
      }
    } catch (err) {
      console.error('❌ Error fetching recipes:', err);
      const errorMessage = err.response?.data?.message || err.message || 'Failed to load recipes';
      setError(errorMessage);
      
      // For development, set some demo data
      setRecipes([
        {
          _id: '1',
          name: 'Demo Recipe',
          description: 'This is a demo recipe',
          price: 299,
          category: 'Main Course',
          image: 'https://via.placeholder.com/300x200?text=Demo+Recipe',
          ingredients: ['Ingredient 1', 'Ingredient 2'],
          preparationTime: '30 min',
          isAvailable: true
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setError('');
      setSuccess('');

      const recipeData = {
        ...formData,
        price: parseFloat(formData.price)
      };

      let response;
      if (editingRecipe) {
        response = await API.put(`/api/recipes/${editingRecipe._id}`, recipeData);
        setSuccess('Recipe updated successfully!');
      } else {
        response = await API.post('/api/recipes', recipeData);
        setSuccess('Recipe created successfully!');
      }

      if (response.data.success) {
        setShowModal(false);
        setEditingRecipe(null);
        setFormData({
          name: '', description: '', price: '', category: '', image: '', 
          ingredients: '', preparationTime: '30 min', isAvailable: true
        });
        fetchRecipes(); // Refresh the list
      }
    } catch (err) {
      console.error('❌ Error saving recipe:', err);
      const errorMessage = err.response?.data?.message || err.message || 'Failed to save recipe';
      setError(errorMessage);
    }
  };

  const handleEdit = (recipe) => {
    setEditingRecipe(recipe);
    setFormData({
      name: recipe.name,
      description: recipe.description,
      price: recipe.price.toString(),
      category: recipe.category,
      image: recipe.image,
      ingredients: recipe.ingredients?.join(', ') || '',
      preparationTime: recipe.preparationTime,
      isAvailable: recipe.isAvailable
    });
    setShowModal(true);
  };

  const handleDelete = async (recipeId) => {
    if (window.confirm('Are you sure you want to delete this recipe?')) {
      try {
        await API.delete(`/api/recipes/${recipeId}`);
        setSuccess('Recipe deleted successfully!');
        fetchRecipes(); // Refresh the list
      } catch (err) {
        const errorMessage = err.response?.data?.message || err.message || 'Failed to delete recipe';
        setError(errorMessage);
      }
    }
  };

  const toggleAvailability = async (recipeId, currentStatus) => {
    try {
      setError('');
      const response = await API.put(`/api/recipes/${recipeId}/availability`, {
        isAvailable: !currentStatus
      });
      
      if (response.data.success) {
        setSuccess(`Recipe ${!currentStatus ? 'enabled' : 'disabled'} successfully!`);
        fetchRecipes(); // Refresh the list
      }
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.message || 'Failed to update availability';
      setError(errorMessage);
    }
  };

  const clearMessages = () => {
    setError('');
    setSuccess('');
  };

  if (loading) {
    return (
      <Container className="my-4">
        <div className="text-center py-5">
          <Spinner animation="border" variant="primary" />
          <h4 className="mt-3">Loading Recipes...</h4>
        </div>
      </Container>
    );
  }

  return (
    <Container className="my-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>🍽️ My Recipes</h2>
        <Button variant="primary" onClick={() => {
          clearMessages();
          setShowModal(true);
        }}>
          + Add New Recipe
        </Button>
      </div>

      {error && (
        <Alert variant="danger" dismissible onClose={clearMessages}>
          {error}
        </Alert>
      )}

      {success && (
        <Alert variant="success" dismissible onClose={clearMessages}>
          {success}
        </Alert>
      )}

      {recipes.length === 0 ? (
        <Card className="text-center py-5">
          <Card.Body>
            <div className="display-1 text-muted mb-3">🍽️</div>
            <h4>No Recipes Found</h4>
            <p className="text-muted mb-4">
              You haven't created any recipes yet. Start by adding your first recipe!
            </p>
            <Button variant="primary" onClick={() => setShowModal(true)}>
              Create Your First Recipe
            </Button>
          </Card.Body>
        </Card>
      ) : (
        <Table responsive striped bordered hover>
          <thead className="table-dark">
            <tr>
              <th>Image</th>
              <th>Name</th>
              <th>Category</th>
              <th>Price</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {recipes.map((recipe) => (
              <tr key={recipe._id}>
                <td>
                  <img 
                    src={recipe.image} 
                    alt={recipe.name}
                    style={{ 
                      width: '60px', 
                      height: '60px', 
                      objectFit: 'cover', 
                      borderRadius: '8px' 
                    }}
                    onError={(e) => {
                      e.target.src = 'https://via.placeholder.com/60x60?text=No+Image';
                    }}
                  />
                </td>
                <td>
                  <strong>{recipe.name}</strong>
                  {recipe.description && (
                    <small className="d-block text-muted">{recipe.description}</small>
                  )}
                </td>
                <td>
                  <Badge bg="info">{recipe.category}</Badge>
                </td>
                <td>₹{recipe.price}</td>
                <td>
                  <Badge bg={recipe.isAvailable ? 'success' : 'secondary'}>
                    {recipe.isAvailable ? 'Available' : 'Unavailable'}
                  </Badge>
                </td>
                <td>
                  <div className="d-flex gap-2">
                    <Button 
                      size="sm" 
                      variant="outline-primary"
                      onClick={() => handleEdit(recipe)}
                    >
                      Edit
                    </Button>
                    <Button 
                      size="sm" 
                      variant="outline-warning"
                      onClick={() => toggleAvailability(recipe._id, recipe.isAvailable)}
                    >
                      {recipe.isAvailable ? 'Disable' : 'Enable'}
                    </Button>
                    <Button 
                      size="sm" 
                      variant="outline-danger"
                      onClick={() => handleDelete(recipe._id)}
                    >
                      Delete
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}

      {/* Add/Edit Recipe Modal */}
      <Modal show={showModal} onHide={() => {
        setShowModal(false);
        setEditingRecipe(null);
        setFormData({
          name: '', description: '', price: '', category: '', image: '', 
          ingredients: '', preparationTime: '30 min', isAvailable: true
        });
        clearMessages();
      }}>
        <Modal.Header closeButton>
          <Modal.Title>
            {editingRecipe ? 'Edit Recipe' : 'Add New Recipe'}
          </Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleSubmit}>
          <Modal.Body>
            <Form.Group className="mb-3">
              <Form.Label>Recipe Name *</Form.Label>
              <Form.Control
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                required
                placeholder="Enter recipe name"
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Description *</Form.Label>
              <Form.Control
                as="textarea"
                rows={2}
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
                required
                placeholder="Enter recipe description"
              />
            </Form.Group>

            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Price (₹) *</Form.Label>
                  <Form.Control
                    type="number"
                    step="0.01"
                    min="0"
                    value={formData.price}
                    onChange={(e) => setFormData({...formData, price: e.target.value})}
                    required
                    placeholder="0.00"
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Category *</Form.Label>
                  <Form.Select
                    value={formData.category}
                    onChange={(e) => setFormData({...formData, category: e.target.value})}
                    required
                  >
                    <option value="">Select Category</option>
                    {categories.map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </Form.Select>
                </Form.Group>
              </Col>
            </Row>

            <Form.Group className="mb-3">
              <Form.Label>Image URL</Form.Label>
              <Form.Control
                type="url"
                value={formData.image}
                onChange={(e) => setFormData({...formData, image: e.target.value})}
                placeholder="https://example.com/image.jpg"
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Ingredients</Form.Label>
              <Form.Control
                as="textarea"
                rows={2}
                value={formData.ingredients}
                onChange={(e) => setFormData({...formData, ingredients: e.target.value})}
                placeholder="Enter ingredients separated by commas"
              />
            </Form.Group>

            <Form.Check
              type="checkbox"
              label="Available for ordering"
              checked={formData.isAvailable}
              onChange={(e) => setFormData({...formData, isAvailable: e.target.checked})}
              className="mb-3"
            />
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowModal(false)}>
              Cancel
            </Button>
            <Button variant="primary" type="submit">
              {editingRecipe ? 'Update Recipe' : 'Add Recipe'}
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </Container>
  );
};

export default RecipeList;