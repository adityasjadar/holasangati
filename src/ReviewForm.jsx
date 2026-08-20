import { useState } from 'react';
import { useLanguage } from '../../i18n/LanguageContext';
import { StarRatingInput, Button, ErrorText, SuccessText, TextArea, Field } from '../ui';
import { submitReview } from '../../services/reviewService';
import { useAuth } from '../../auth/AuthContext';

export default function ReviewForm({ reviewedUserId, contactRequestId, onDone }) {
  const { t } = useLanguage();
  const { user } = useAuth();
  const [rating, setRating] = useState(5);
  const [review, setReview] = useState('');
  const [error, setError] = useState('');
  const [done, setDone] = useState(false);
  const [busy, setBusy] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setBusy(true);
    try {
      await submitReview({ reviewerId: user.id, reviewedUserId, contactRequestId, rating, review });
      setDone(true);
      onDone?.();
    } catch (err) {
      // Most likely cause: no accepted contact_request exists yet — the DB enforces this.
      setError(err.message);
    } finally {
      setBusy(false);
    }
  }

  if (done) return <SuccessText>{t('save')}</SuccessText>;

  return (
    <form onSubmit={handleSubmit}>
      <Field label={t('rating')}>
        <StarRatingInput value={rating} onChange={setRating} />
      </Field>
      <Field label={t('write_review')}>
        <TextArea value={review} onChange={(e) => setReview(e.target.value)} rows={3} />
      </Field>
      <ErrorText>{error}</ErrorText>
      <Button type="submit" disabled={busy}>{busy ? t('loading') : t('save')}</Button>
    </form>
  );
}
