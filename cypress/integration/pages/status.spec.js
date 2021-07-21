/// <reference types="cypress" />
context('status page', () => {
  beforeEach(() => {
    cy.injectAxe();
  });

  describe('Sent status', () => {
    it('shows status form', () => {
      cy.visit('/referrals/status/1');
      cy.get('[data-testid=status-form-accepted-radio-item]').should('contain', 'Yes');
      cy.get('[data-testid=status-form-rejected-radio-item]').should('contain', 'No');
      cy.get('[data-testid=status-form-accepted-input]').click();
      cy.get('[data-testid=status-form-rejected-comment]').should('be.hidden');
      cy.get('[data-testid=status-form-rejected-input]').click();
      cy.get('[data-testid=status-form-rejected-comment]').should('not.be.hidden');
    });
  });

  describe('Completed status', () => {
    it('shows rejected status with date and comments', () => {
      cy.visit('/referrals/status/2');
      cy.get('[data-testid=status-paragraph]').should(
        'contain',
        'This referral was REJECTED on 22/07/2021 at 9:17 with comment "comment".'
      );
    });
    it('shows rejected status with date, without comments', () => {
      cy.visit('/referrals/status/3');
      cy.get('[data-testid=status-paragraph]').should(
        'contain',
        'This referral was REJECTED on 22/07/2021 at 9:17'
      );
    });
    it('shows acccepted status with date', () => {
      cy.visit('/referrals/status/4');
      cy.get('[data-testid=status-paragraph]').should(
        'contain',
        'This referral was ACCEPTED on 22/07/2021 at 9:17'
      );
    });
  });
});
