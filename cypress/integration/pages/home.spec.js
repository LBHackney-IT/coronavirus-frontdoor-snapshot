/// <reference types="cypress" />
context('Index page', () => {
  beforeEach(() => {
    cy.visit('/');
    cy.injectAxe();
  });

  describe('Page structure', () => {
    it('has the right headings', () => {
      cy.contains('Discuss a topic').should('be.visible');
      cy.contains('Resources for residents').should('be.visible');
    });

    it('has no content outside top-level headings', () => {
      cy.checkA11y('#content > h2', null, cy.terminalLog);
    });
  });

  describe('Resources', () => {
    it('shows category headers containing resources', () => {
      cy.get('[data-testid=accordion-item]').should('have.length', 3);
      cy.get('[data-testid=accordion-item]')
        .should('contain', 'First category')
        .and('contain', 'Second category')
        .and('contain', 'Third category');
    });

    it('does not show category headers without resources', () => {
      cy.get('[data-testid=accordion-item]').should('not.contain', 'Fourth category');
    });

    it('Displays the resources', () => {
      cy.get('[data-testid=accordion-item]')
        .eq(0)
        .click();

      cy.get('[data-testid=accordion-content]')
        .eq(0)
        .children()
        .should('have.length', 5);

      cy.get('[data-testid=resource-1]')
        .eq(0)
        .should('contain', 'First service');

      cy.get('[data-testid=resource-2]')
        .eq(0)
        .should('contain', 'Second service');
    });

    it('Displays the correct tags', () => {
      cy.get('[data-testid=accordion-item]')
        .eq(0)
        .click();

      cy.get('[data-testid=resource-card-tags]')
        .eq(0)
        .should('contain', 'First category')
        .and('contain', 'Council')
        .children()
        .should('have.length', 2);

      cy.get('[data-testid=resource-card-tags]')
        .eq(2)
        .should('contain', 'First category')
        .and('contain', 'Second category')
        .children()
        .should('have.length', 2);
    });

    it('Displays the correct resource information for council resources', () => {
      cy.get('[data-testid=accordion-item]')
        .eq(0)
        .click();

      cy.get('[data-testid=resource-ABC123]')
        .eq(0)
        .should('contain', 'ABC  mental health Test')
        .and('contain', 'Telephone')
        .and('contain', '123456421')
        .and('contain', 'Email')
        .and('contain', 'test@abc.testy.com')
        .and('contain', 'Description')
        .and('contain', 'Description for ABC  mental health Test services')
        .and('contain', "Who's this for?")
        .and('contain', 'this is for you')
        .and('contain', 'Relevant support')
        .and('contain', 'some details')
        .and('contain', 'Address')
        .and('contain', '101 Test Ln, Hackney')
        .and('contain', 'Website')
        .and('contain', 'https://sample.com/test_mental_health')
        .and('contain', 'https://sample.com/test_mental_health_too')
        .and('contain', 'Online referral')
        .and('contain', 'https://www.test.abc.com');
    });

    it('Displays the correct resource information for FSS resources', () => {
      cy.get('[data-testid=accordion-item]')
        .eq(0)
        .click();

      cy.get('[data-testid=resource-1]')
        .eq(0)
        .should('contain', 'First service')
        .and('contain', 'Telephone')
        .and('contain', '07000 0000000')
        .and('contain', 'Email')
        .and('contain', 'help@gmail.com')
        .and('contain', 'Description')
        .and('contain', 'First service description')
        .and('contain', "Who's this for?")
        .and('contain', 'Housing advice, Cultural')
        .and('contain', 'Relevant support')
        .and('contain', 'Help with first category from the first service')
        .and('contain', 'Address')
        .and('contain', '404 error, not, found')
        .and('contain', 'Website')
        .and('contain', 'https://www.sample.org.uk')
        .and('contain', 'Online referral')
        .and('contain', 'referal.form.com');
    });
  });

  describe('Topic Explorer', () => {
    it('can show food example prompts', () => {
      cy.get('#keyword-search')
        .contains('food')
        .click();
      cy.get('#topic-search').should('have.value', 'food');
    });

    it('can show health example prompts', () => {
      cy.get('#keyword-search')
        .contains('health')
        .click();
      cy.get('#topic-search').should('have.value', 'health');
    });

    it('can show benefits prompts', () => {
      cy.get('#keyword-search')
        .contains('benefits')
        .click();
      cy.get('#topic-search').should('have.value', 'benefits');
    });

    it('does not show search options when there is no text in the input', () => {
      cy.get('#topic-search').click();
      cy.get('option').should('not.exist');
    });

    it('does show search options when there is text in the input', () => {
      cy.get('#topic-search').type('a');
      cy.get('option').should('exist');
    });
  });
});
