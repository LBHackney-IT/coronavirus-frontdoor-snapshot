import css from './index.module.scss';
import notificationCss from '../../notification-messages.module.scss';
import { useState } from 'react';
import { sendDataToAnalytics, getUserGroup } from 'lib/utils/analytics';
import {
  REFERRAL_OPEN,
  REFERRAL_CLICK_WEBSITE,
  SERVICE_CLICK_WEBSITE,
  VIEW_SUMMARY_EMAIL_CLICKED
} from 'lib/utils/constants';
import ReferralForm from 'components/Feature/ReferralForm';

const ResourceCard = ({
  updateSelectedResources,
  email,
  referralContact,
  referralWebsite,
  notes,
  distance,
  matches,
  customerId,
  categoryName,
  serviceDescription,
  residentInfo,
  categoryId,
  referralCompletion,
  setReferralCompletion,
  detailsClicked,
  openReferralForm,
  referralData,
  setReferralData,
  referrerData,
  setReferrerData,
  demographic,
  updateSignpostSummary,
  signpostSummary,
  councilTags,
  setResidentInfo,
  token,
  referralSummary,
  setReferralSummary,
  updateEmailBody,
  setEmailBody,
  setPreserveFormData,
  preserveFormData,
  resource,
  ...others
}) => {
  const [noteOpen, setNoteOpen] = useState(false);

  const trimLength = (s, length) => (s.length > length ? s.substring(0, length) + '...' : s);

  const tagsElement = resource.tags.map(item => (
    <span key={'tags-' + item} className={`${css.tags} tag-element`}>
      {trimLength(item, 20)}
    </span>
  ));
  const councilTagsElement = councilTags.map(item => (
    <span key={'tags-' + item} className={`${css.tags} tag-element ${css[`Council-tag`]}`}>
      {trimLength(item, 20)}
    </span>
  ));
  const snapshot = customerId != undefined ? true : false;
  const updateResource = () => {
    updateSelectedResources({
      name: resource.name,
      description: resource.description,
      address: resource.address,
      telephone: resource.telephone,
      email: email,
      referralContact: referralContact,
      websites: resource.websites,
      notes: notes
    });
  };

  const fullDescription = [serviceDescription, resource.description].join(' ');
  const first = fullDescription?.substring(0, 250);
  const second = fullDescription?.substring(250);

  return (
    <div
      className={`resource ${css.resource}`}
      {...others}
      id={`resource-container-${resource.id}`}>
      <div className={`${css.tags__container} card-header-tag`} data-testid="resource-card-tags">
        {tagsElement}
        {councilTagsElement}
      </div>
      <div>
        <div className={`govuk-grid-row`}>
          <div
            className={`govuk-grid-column-two-thirds header-container ${css['header-container']}`}>
            <h3 data-testid="resource-card-header">
              {resource.websites?.length > 0 ? (
                <a
                  key={`website-link-${resource.websites[0]}`}
                  href={resource.websites[0]}
                  target="_blank"
                  onClick={() => {
                    sendDataToAnalytics({
                      action: getUserGroup(referrerData['user-groups']),
                      category: SERVICE_CLICK_WEBSITE,
                      label: resource.name
                    });
                  }}
                  rel="noopener noreferrer">
                  {resource.name}
                </a>
              ) : (
                resource.name
              )}
            </h3>
            {demographic?.trim().length > 0 && <span>This is for {demographic}</span>}
          </div>

          <div className={`govuk-grid-column-one-third ${css['contact-container']}`}>
            {resource.telephone?.length > 0 && <h4>{resource.telephone}</h4>}

            {email?.includes('@') && (
              <div>
                <a href={`mailto:${email}`}>{email}</a>
              </div>
            )}

            {resource.address?.length > 0 && <span>{resource.address}</span>}
          </div>
        </div>
        {fullDescription && (
          <p>
            {first}
            {second.length > 0 && !noteOpen ? (
              <>
                ...
                <button onClick={() => setNoteOpen(true)} className={css['toggle-button']}>
                  Show more
                </button>
              </>
            ) : (
              ''
            )}
            {noteOpen && second}
            {noteOpen && (
              <button onClick={() => setNoteOpen(false)} className={css['toggle-button']}>
                Show less
              </button>
            )}
          </p>
        )}
        <div className={`govuk-grid-row`}>
          <div className={`govuk-grid-column-one-half`}>
            <div className={`govuk-checkboxes__item ${css['inline-header']}`}>
              <input
                className="govuk-checkboxes__input"
                id={`add-to-summary-checkbox-${resource.id}-${categoryId}`}
                name="add-to-summary-checkbox"
                type="checkbox"
                onClick={() => {
                  updateSignpostSummary({
                    id: resource.id,
                    name: resource.name,
                    telephone: resource.telephone,
                    contactEmail: email,
                    referralEmail: referralContact,
                    address: resource.address,
                    websites: resource.websites.join(', '),
                    categoryName
                  });
                }}
                value={true}
                checked={signpostSummary?.some(x => x.name == resource.name)}
              />
              <label
                className={`govuk-label govuk-checkboxes__label ${css['checkbox-label']}`}
                htmlFor={`add-to-summary-checkbox-${resource.id}-${categoryId}`}>
                Share service with a resident
              </label>
            </div>
          </div>
          <div>
            {referralContact?.length > 0 ? (
              <span id={`referral-${resource.id}-${categoryId}-details`} name="refer-details">
                {(openReferralForm.id != resource.id ||
                  openReferralForm.categoryName != categoryName) && (
                  <button
                    id={`referral-${resource.id}-${categoryId}`}
                    className={`govuk-button ${css['refer-button']}`}
                    type="button"
                    data-testid="refer-button"
                    onClick={e => {
                      detailsClicked(
                        e,
                        `referral-${resource.id}-${categoryId}-details`,
                        resource.id,
                        categoryName
                      );
                      sendDataToAnalytics({
                        action: getUserGroup(referrerData['user-groups']),
                        category: REFERRAL_OPEN,
                        label: resource.name
                      });
                    }}>
                    Create Referral
                  </button>
                )}
                {openReferralForm.id == resource.id &&
                  openReferralForm.categoryName == categoryName && (
                    <button
                      id={`referral-${resource.id}-${categoryId}`}
                      className={`govuk-button ${css['refer-button']} govuk-button--secondary`}
                      type="button"
                      data-testid="refer-button"
                      onClick={e =>
                        detailsClicked(
                          e,
                          `referral-${resource.id}-${categoryId}-details`,
                          resource.id,
                          categoryName
                        )
                      }>
                      Cancel
                    </button>
                  )}
                {openReferralForm.id == resource.id &&
                  openReferralForm.categoryName == categoryName &&
                  (referralCompletion[resource.id] ? (
                    <div className={`govuk-!-padding-top-8`}>
                      {referralCompletion[resource.id].errors?.length > 0 && (
                        <div
                          data-testid="referral-errors-banner"
                          className={`${notificationCss['error-message']}`}>
                          {referralCompletion[resource.id].errors.join('\n')}
                        </div>
                      )}
                      {!referralCompletion[resource.id].errors?.includes(
                        'Failed to send referral email to service'
                      ) && (
                        <div
                          data-testid="successful-referral-banner"
                          className={`${notificationCss['success-message']}`}>
                          Successfully submitted referral for {residentInfo?.firstName}{' '}
                          {residentInfo?.lastName}
                        </div>
                      )}
                      <button
                        type="button"
                        className={`govuk-button ${notificationCss['notification-button']}`}
                        onClick={e => {
                          setPreserveFormData(true);
                          detailsClicked(
                            e,
                            `referral-${resource.id}-${categoryId}-details`,
                            resource.id,
                            categoryName
                          );
                        }}
                        data-testid="continue-call-button">
                        Continue Call
                      </button>
                      <button
                        type="button"
                        className={`govuk-button ${notificationCss['notification-button']}`}
                        onClick={() => (window.location = process.env.NEXT_PUBLIC_URL)}
                        data-testid="finish-call-button">
                        Finish Call
                      </button>
                    </div>
                  ) : (
                    <div
                      id={`referral-${resource.id}-${categoryId}-form`}
                      className={css['referral-form']}>
                      <ReferralForm
                        setResidentInfo={setResidentInfo}
                        token={token}
                        setReferralCompletion={setReferralCompletion}
                        referralCompletion={referralCompletion}
                        referralSummary={referralSummary}
                        setReferralSummary={setReferralSummary}
                        updateEmailBody={updateEmailBody}
                        setEmailBody={setEmailBody}
                        referrerData={referrerData}
                        id={resource.id}
                        email={email}
                        name={resource.name}
                        description={resource.description}
                        websites={resource.websites}
                        address={resource.address}
                        telephone={resource.telephone}
                        referralContact={referralContact}
                        referralData={referralData}
                        setReferrerData={setReferrerData}
                        setReferralData={setReferralData}
                        preserveFormData={preserveFormData}
                        setPreserveFormData={setPreserveFormData}
                        residentInfo={residentInfo}
                        detailsClicked={detailsClicked}
                        categoryId={categoryId}
                      />
                    </div>
                  ))}
              </span>
            ) : (
              referralWebsite?.length > 0 &&
              (referralWebsite.startsWith('http') ? (
                <a
                  href={referralWebsite}
                  target="_blank"
                  onClick={() =>
                    sendDataToAnalytics({
                      action: getUserGroup(referrerData['user-groups']),
                      category: REFERRAL_CLICK_WEBSITE,
                      label: resource.name
                    })
                  }
                  data-testid="refer-link"
                  className={css['refer-link']}>
                  Refer via external website
                </a>
              ) : (
                <span className={css['refer-text']} data-testid="refer-text">
                  <h4>Referral information</h4>
                  <span>{referralWebsite}</span>
                </span>
              ))
            )}
          </div>
        </div>
      </div>
      {signpostSummary?.some(x => x.name == resource.name) && (
        <div
          className={`${css['success-message']}`}
          data-testid={`added-to-summary-banner-${resource.id}-${categoryId}`}>
          You have added a service to your summary message
          <a
            className={`${css['summary-link']}`}
            href="#summary-header"
            onClick={() => {
              document.getElementById('span-summary-form').click();
              sendDataToAnalytics({
                action: getUserGroup(referrerData['user-groups']),
                category: VIEW_SUMMARY_EMAIL_CLICKED,
                label: resource.name
              });
            }}>
            View summary message
          </a>
        </div>
      )}
      {snapshot && (
        <div className="govuk-checkboxes__item">
          <input
            className="govuk-checkboxes__input"
            id={`input-${resource.id}`}
            onClick={() => updateResource()}
            type="checkbox"
            value={resource.name}
          />
          <label className="govuk-label govuk-checkboxes__label" id={`label-${resource.id}`}>
            Would you like to recommend this resource?
          </label>
        </div>
      )}
      <hr className="govuk-section-break govuk-section-break--m govuk-section-break--visible" />
    </div>
  );
};

export default ResourceCard;
