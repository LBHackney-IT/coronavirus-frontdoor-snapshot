/// <reference types="cypress" />
context('status page', () => {
  describe('Sent status', () => {
    it('hides & shows reject reason error styles approapriately', () => {
      cy.visit('/referrals/status/1');
      cy.injectAxe();
      // Error should not be visible
      cy.get('[data-testid=status-form-rejected-input]').click();
      cy.get('[data-testid=reject-comment-error]').should('be.hidden');
      // Error should become visible
      cy.get('[data-testid=submit-status-form]').click();
      cy.get('[data-testid=reject-comment-error]').should('not.be.hidden');
      // Accessibility
      cy.runCheckA11y();
      // When typing into the input, error should disappear
      cy.get('[data-testid=status-form-rejected-comment-input]').type(
        'Heart of the Cards, guide me! I draw!'
      );
      cy.get('[data-testid=reject-comment-error]').should('be.hidden');
      // When deleting everything within input, error should reappear
      cy.get('[data-testid=status-form-rejected-comment-input]').clear();
      cy.get('[data-testid=reject-comment-error]').should('not.be.hidden');
    });

    it('shows status form', () => {
      cy.visit('/referrals/status/1');
      cy.injectAxe();

      cy.get('[data-testid=status-form-accepted-radio-item]').should('contain', 'Yes');
      cy.get('[data-testid=status-form-rejected-radio-item]').should('contain', 'No');
      cy.get('[data-testid=status-form-accepted-input]').click();
      cy.get('[data-testid=status-form-rejected-comment]').should('be.hidden');
      cy.get('[data-testid=status-form-rejected-input]').click();
      cy.get('[data-testid=status-form-rejected-comment]').should('not.be.hidden');

      cy.runCheckA11y();
    });
  });

  describe('Completed status', () => {
    it('shows rejected status with date and comments', () => {
      cy.visit('/referrals/status/2');
      cy.injectAxe();

      cy.get('[data-testid=status-paragraph]').should(
        'contain',
        'This referral was REJECTED on 22/07/2021 at 9:17 with comment: "comment".'
      );

      cy.runCheckA11y();
    });
    it('shows rejected status with date, without comments', () => {
      cy.visit('/referrals/status/3');
      cy.injectAxe();

      cy.get('[data-testid=status-paragraph]').should(
        'contain',
        'This referral was REJECTED on 22/07/2021 at 9:17'
      );

      cy.runCheckA11y();
    });
    it('shows acccepted status with date', () => {
      cy.visit('/referrals/status/4');
      cy.injectAxe();

      cy.get('[data-testid=status-paragraph]').should(
        'contain',
        'This referral was ACCEPTED on 22/07/2021 at 9:17'
      );

      cy.runCheckA11y();
    });
  });
});
