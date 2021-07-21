/// <reference types="cypress" />
context('status page', () => {
  beforeEach(() => {
    cy.injectAxe();
  });

  describe('Accept referral', () => {
    it('shows status form', () => {
      cy.visit('/referrals/status/1');
      cy.get('[data-testid=status-form-accepted-radio-item]').should('contain', 'Yes');
      cy.get('[data-testid=status-form-accepted-input]').click();
      cy.get('[data-testid=status-confirmation-panel]').should('not.exist');

      cy.get('[data-testid=submit-status-form]').click();

      cy.get('[data-testid=status-confirmation-panel]').should('contain', 'Thank you');
      cy.get('[data-testid=status-confirmation-panel]').should(
        'contain',
        'Your decision on this referral has been sent'
      );
      cy.visit('/referrals/status/1');

      cy.get('[data-testid=status-paragraph]').should('contain', 'This referral was ACCEPTED on');
      cy.resetReferralStatus('11', [
        {
          date: '2021-07-20T09:17:23.305Z',
          status: 'SENT'
        }
      ]);
    });
  });

  describe('Reject referral', () => {
    it('with comment', () => {
      cy.visit('/referrals/status/1');
      cy.get('[data-testid=status-form-rejected-radio-item]').should('contain', 'No');
      cy.get('[data-testid=status-form-rejected-input]').click();
      cy.get('[data-testid=status-form-rejected-comment-input]').type('comment');

      cy.get('[data-testid=status-confirmation-panel]').should('not.exist');

      cy.get('[data-testid=submit-status-form]').click();
      cy.get('[data-testid=status-confirmation-panel]').should('contain', 'Thank you');
      cy.get('[data-testid=status-confirmation-panel]').should(
        'contain',
        'Your decision on this referral has been sent'
      );

      cy.visit('/referrals/status/1');

      cy.get('[data-testid=status-paragraph]').should('contain', 'This referral was REJECTED on');
      cy.get('[data-testid=status-paragraph]').should('contain', 'with comment "comment".');
      cy.resetReferralStatus('11', [
        {
          date: '2021-07-20T09:17:23.305Z',
          status: 'SENT'
        }
      ]);
    });
  });
});
