describe('Formulario de creación de productos', () => {
  it('Debería permitir crear un producto', () => {
    cy.visit('/dashboard/products');

    // Llenar el formulario
    cy.get('input[name="name"]').type('Monstera Deliciosa');
    cy.get('input[name="price"]').type('29.99');
    cy.get('textarea[name="description"]').type('Una planta tropical perfecta para interiores.');
    cy.get('input[name="stock"]').type('50');
    cy.get('input[name="category"]').type('Plantas de interior');

    // Subir imagen
    cy.get('input[type="file"]').selectFile('cypress/fixtures/monstera.jpg');

    // Enviar formulario
    cy.get('button[type="submit"]').click();

    // Verificar éxito
    cy.contains('Producto creado exitosamente').should('be.visible');
  });
});
