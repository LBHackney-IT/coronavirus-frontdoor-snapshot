/// <reference types="cypress" />
context('Index page', () => {
  beforeEach(() => {
    cy.visit('/');
    cy.injectAxe();
  });

  describe('Loads page', () => {
    it('has heading', () => {
      cy.get('h1').should('have.text', 'Resource Finder');
      cy.checkA11y('#content > h1', null, cy.terminalLog);
    });
  });

  describe('Resources', () => {
    it('shows resources per category', () => {
      cy.get('h2').should('contain', 'Things to explore with the resident');

      cy.get('[data-testid=accordion-item]')
        .should('contain', 'Food')
        .and('contain', 'Financial stability')
        .and('contain', 'Physical health')
        .and('contain', 'Mental health')
        .and('contain', 'Behaviour and engagement')
        .and('contain', 'Relationships and support network')
        .and('contain', 'Life events and transitions');
    });


    it('Ranks resources by relevance', () => {
      cy.get('[data-testid=accordion-item]').eq(0).click();
      cy.get('[data-testid=food-needs-v-halal-checkbox]').click();

      cy.get('[data-testid=resource-rec2FkHGEn9BiiXvW] > h3').eq(0)
        .should('contain', 'Made Up Kitchen')

      cy.get('[data-testid=food-needs-v-vegetarian-checkbox]').click();
      cy.get('[data-testid=resource-rec2FkHGEn9BiiXvW] > h3').eq(0)
        .should('contain', 'Made Up Kitchen')
    });


    it('Ranks resources by postcode', () => {
      cy.get('#Postcode').type('E1 6AW')
      cy.get('[data-testid=accordion-item]').eq(0).click();
      cy.get('[data-testid=food-needs-v-halal-checkbox]').click();
      cy.get('[data-testid=food-needs-v-vegetarian-checkbox]').click();
      cy.get('.govuk-accordion__section--expanded > .govuk-accordion__section-content > .govuk-grid-column-full-width > :nth-child(1) > .resource').eq(0)
        .should('contain', 'Shirdi Sai Baba Temple')
      cy.get('[data-testid=resource-recisR36NAVBna3N4] > :nth-child(3) > #resourceInfo > :nth-child(1) > .govuk-summary-list__value')
        .should('contain', '1.10 miles')
    });


    it('Displays an error when postcodes coordinates are not found', () => {
      cy.get('#Postcode').type('ABC123')
      cy.get('[data-testid=accordion-item]').eq(0).click();
      cy.get('.govuk-error-message').should('contain', 'Could not find coordinates for: ABC123')
    });

  });
});
