/// <reference types="cypress" />
context('Index page', () => {
  beforeEach(() => {
    cy.visit('/');
    cy.injectAxe();
  });

  describe('Page structure', () => {
    it('has the right headings', () => {
      cy.contains('Discuss a topic').should('be.visible')
      cy.contains('Resources for residents').should('be.visible')
    });

    it('has no content outside top-level headings', () => {
      cy.checkA11y('#content > h2', null, cy.terminalLog);
    });
  });

  describe('Resources', () => {
    it('shows resources per category', () => {

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
      cy.get('[data-testid=resource-recisR36NAVBna3N4] > h3').eq(0)
        .should('contain', 'Shirdi Sai Baba Temple')
      // cy.get('[data-testid=resource-recisR36NAVBna3N4] > :nth-child(3) > #resourceInfo > :nth-child(1) > .govuk-summary-list__value')
      //   .should('contain', '1.10 miles')
    });


    it('Displays an error when postcodes coordinates are not found', () => {
      cy.get('#Postcode').type('ABC123')
      cy.get('[data-testid=accordion-item]').eq(0).click();
      cy.get('.govuk-error-message').should('contain', 'Could not find coordinates for: ABC123')
    });

  });

  describe("Topic Explorer", () => {

    it("can show food example prompts", () => {
      cy.get("#example-search").contains('food').click();
      cy.get('input').should('have.value', 'food')
    })


    it("can show health example prompts", () => {
      cy.get("#example-search").contains('health').click();
      cy.get('input').should('have.value', 'health')
    })


    it("can show benefits prompts", () => {
      cy.get("#example-search").contains('benefits').click();
      cy.get('input').should('have.value', 'benefits')
    })


    it("does not show search options when there is no text in the input", () => {
      cy.get('#text-input').click()
      cy.get('option').should('not.exist')
    })

    it("does show search options when there is text in the input", () => {
      cy.get('#text-input').type('a')
      cy.get('option').should('exist')
    })
  })

});
