describe('Login y creación de producto', () => {
  it('Debería loguearse y crear un producto', () => {
    cy.visit('/auth/login');
    cy.get('input[type="email"]').type('jose@gmail.com');
    cy.get('input[type="password"]').type('12345');
    cy.get('button[type="submit"], button:contains("Iniciar sesión")').click();
    cy.url().should('include', '/dashboard');

    cy.visit('/dashboard/products/create');
    cy.get('input[name="name"], input[placeholder*="Nombre"]').clear().type('Monstera Deliciosa');
    cy.get('input[name="price"], input[placeholder*="Precio"]').clear().type('29.99');
    cy.get('textarea[name="description"], input[name="description"], input[placeholder*="Descripción"]').clear().type('Planta tropical de hojas grandes.');
    cy.get('input[name="stock"], input[placeholder*="Stock"]').clear().type('50');
    cy.get('input[name="category"], input[placeholder*="Categoría"]').clear().type('Plantas de interior');
    cy.get('input[type="file"]').selectFile('cypress/fixtures/J.jpeg');
    cy.get('button[type="submit"]').click();
    cy.contains('Producto creado exitosamente').should('be.visible');
    cy.get('body').then($body => {
      if ($body.text().includes('Error')) {
        cy.log('Error detectado en la creación de producto');
        cy.screenshot();
      }
    });
  });
});
