import css from './index.module.scss';
import notificationCss from '../../notification-messages.module.scss';
import { useState } from 'react';
import { sendDataToAnalytics, getUserGroup } from 'lib/utils/analytics';
import {
  REFERRAL_OPEN,
  REFERRAL_CLICK_WEBSITE,
  SERVICE_CLICK_WEBSITE,
  VIEW_SUMMARY_EMAIL_CLICKED
} from 'lib/utils/analyticsConstants';
import ReferralForm from 'components/Feature/ReferralForm';

const ResourceCard = ({
  id,
  updateSelectedResources,
  name,
  description,
  websites,
  address,
  postcode,
  tags,
  telephone,
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
  ...others
}) => {
  const [noteOpen, setNoteOpen] = useState(false);

  const trimLength = (s, length) => (s.length > length ? s.substring(0, length) + '...' : s);

  const tagsElement = tags.map(item => (
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
      name: name,
      description: description,
      address: address,
      telephone: telephone,
      email: email,
      referralContact: referralContact,
      websites: websites,
      notes: notes
    });
  };

  const fullDescription = [serviceDescription, description].join(' ');
  const first = fullDescription?.substring(0, 250);
  const second = fullDescription?.substring(250);

  return (
    <div className={`resource ${css.resource}`} {...others} id={`resource-container-${id}`}>
      <div className={`${css.tags__container} card-header-tag`} data-testid="resource-card-tags">
        {tagsElement}
        {councilTagsElement}
      </div>
      <div>
        <div className={`govuk-grid-row`}>
          <div
            className={`govuk-grid-column-two-thirds header-container ${css['header-container']}`}>
            <h3 data-testid="resource-card-header">
              {websites?.length > 0 ? (
                <a
                  key={`website-link-${websites[0]}`}
                  href={websites[0]}
                  target="_blank"
                  onClick={() => {
                    sendDataToAnalytics({
                      action: getUserGroup(referrerData['user-groups']),
                      category: SERVICE_CLICK_WEBSITE,
                      label: name
                    });
                  }}
                  rel="noopener noreferrer">
                  {name}
                </a>
              ) : (
                name
              )}
            </h3>
            {demographic?.length > 0 && <span>This is for {demographic}</span>}
          </div>

          <div className={`govuk-grid-column-one-third ${css['contact-container']}`}>
            {telephone?.length > 0 && <h4>{telephone}</h4>}

            {email?.includes('@') && (
              <div>
                <a href={`mailto:${email}`}>{email}</a>
              </div>
            )}

            {address?.length > 0 && <span>{address}</span>}
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
                id={`add-to-summary-checkbox-${id}-${categoryId}`}
                name="add-to-summary-checkbox"
                type="checkbox"
                onClick={() => {
                  updateSignpostSummary({
                    id,
                    name,
                    telephone,
                    contactEmail: email,
                    referralEmail: referralContact,
                    address,
                    websites: websites.join(', '),
                    categoryName
                  });
                }}
                value={true}
                checked={signpostSummary?.some(x => x.name == name)}
              />
              <label
                className={`govuk-label govuk-checkboxes__label ${css['checkbox-label']}`}
                htmlFor={`add-to-summary-checkbox-${id}-${categoryId}`}>
                Share service with a resident
              </label>
            </div>
          </div>
          <div>
            {referralContact?.length > 0 ? (
              <span id={`referral-${id}-${categoryId}-details`} name="refer-details">
                {(openReferralForm.id != id || openReferralForm.categoryName != categoryName) && (
                  <button
                    id={`referral-${id}-${categoryId}`}
                    className={`govuk-button ${css['refer-button']}`}
                    type="button"
                    data-testid="refer-button"
                    onClick={e => {
                      detailsClicked(e, `referral-${id}-${categoryId}-details`, id, categoryName);
                      sendDataToAnalytics({
                        action: getUserGroup(referrerData['user-groups']),
                        category: REFERRAL_OPEN,
                        label: name
                      });
                    }}>
                    Create Referral
                  </button>
                )}
                {openReferralForm.id == id && openReferralForm.categoryName == categoryName && (
                  <button
                    id={`referral-${id}-${categoryId}`}
                    className={`govuk-button ${css['refer-button']} govuk-button--secondary`}
                    type="button"
                    data-testid="refer-button"
                    onClick={e =>
                      detailsClicked(e, `referral-${id}-${categoryId}-details`, id, categoryName)
                    }>
                    Cancel
                  </button>
                )}
                {openReferralForm.id == id &&
                  openReferralForm.categoryName == categoryName &&
                  (referralCompletion[id] ? (
                    <div className={`govuk-!-padding-top-8`}>
                      {referralCompletion[id].errors?.length > 0 && (
                        <div
                          data-testid="referral-errors-banner"
                          className={`${notificationCss['error-message']}`}>
                          {referralCompletion[id].errors.join('\n')}
                        </div>
                      )}
                      <div
                        data-testid="successful-referral-banner"
                        className={`${notificationCss['success-message']}`}>
                        Successfully submitted referral for {residentInfo?.firstName}{' '}
                        {residentInfo?.lastName}
                      </div>
                      <button
                        type="button"
                        className={`govuk-button ${notificationCss['notification-button']}`}
                        onClick={e => {
                          setPreserveFormData(true);
                          detailsClicked(
                            e,
                            `referral-${id}-${categoryId}-details`,
                            id,
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
                    <div id={`referral-${id}-${categoryId}-form`} className={css['referral-form']}>
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
                        id={id}
                        email={email}
                        name={name}
                        description={description}
                        websites={websites}
                        address={address}
                        telephone={telephone}
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
                      label: name
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
      {signpostSummary?.some(x => x.name == name) && (
        <div
          className={`${css['success-message']}`}
          data-testid={`added-to-summary-banner-${id}-${categoryId}`}>
          You have added a service to your summary email
          <a
            className={`${css['summary-link']}`}
            href="#summary-header"
            onClick={() =>
              sendDataToAnalytics({
                action: getUserGroup(referrerData['user-groups']),
                category: VIEW_SUMMARY_EMAIL_CLICKED,
                label: name
              })
            }>
            View summary email
          </a>
        </div>
      )}
      {snapshot && (
        <div className="govuk-checkboxes__item">
          <input
            className="govuk-checkboxes__input"
            id={`input-${id}`}
            onClick={() => updateResource()}
            type="checkbox"
            value={name}
          />
          <label className="govuk-label govuk-checkboxes__label" id={`label-${id}`}>
            Would you like to recommend this resource?
          </label>
        </div>
      )}
      <hr className="govuk-section-break govuk-section-break--m govuk-section-break--visible" />
    </div>
  );
};

export default ResourceCard;
