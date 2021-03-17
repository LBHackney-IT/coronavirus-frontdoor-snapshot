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

  describe('When the copy icon next to a referral service is clicked', () => {
    it('it copies the referral information to the clipboard', () => {
      cy.get('[data-testid=accordion-item]')
          .eq(0)
          .click();
      cy.get('[data-testid=resource-1]')
          .eq(0)
      cy.get('#copy-clipboard-icon-abc').eq(0).click({ force: true });
      cy.task('getClipboard').should('contain', 'Service Name: ABC  mental health Test' + 
          '\nTelephone: 123456421' + 
          '\nService Description: Description for ABC  mental health Test services' + 
          '\nAddress: 101 Test Ln, Hackney' + 
          '\nWebsites: "https://sample.com/test_mental_health","https://sample.com/test_mental_health_too"' + 
          '\nReferral website: https://www.test.abc.com' + 
          '\nReferral email: abc@refer.testy.com');
    });
  });
});

