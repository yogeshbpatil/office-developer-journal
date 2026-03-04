'use client';

import { useEffect, useState, FormEvent } from 'react';
import { CreateStandupDto, Standup } from '@/models/Standup';
import { standupService } from '@/services/standup-service';

interface StandupFormProps {
  initialData?: Partial<CreateStandupDto>;
  mode?: 'create' | 'edit';
  standupId?: string;
  isLoading?: boolean;
  onSubmitting?: () => void;
  onSuccess?: (createdStandup: Standup) => void;
  onError?: (message: string) => void;
}

export default function StandupForm({
  initialData,
  mode = 'create',
  standupId,
  isLoading = false,
  onSubmitting,
  onSuccess,
  onError,
}: StandupFormProps) {
  const [formData, setFormData] = useState<CreateStandupDto>({
    standupDate: initialData?.standupDate || new Date().toISOString().split('T')[0],
    discussionPoints: initialData?.discussionPoints || '',
    todayPlan: initialData?.todayPlan || '',
    blockers: initialData?.blockers || '',
    targets: initialData?.targets || '',
    notes: initialData?.notes || '',
  });

  useEffect(() => {
    setFormData({
      standupDate: initialData?.standupDate || new Date().toISOString().split('T')[0],
      discussionPoints: initialData?.discussionPoints || '',
      todayPlan: initialData?.todayPlan || '',
      blockers: initialData?.blockers || '',
      targets: initialData?.targets || '',
      notes: initialData?.notes || '',
    });
    setErrors({});
    setSubmitError('');
  }, [initialData]);

  const [errors, setErrors] = useState<Partial<Record<keyof CreateStandupDto, string>>>({});
  const [submitError, setSubmitError] = useState('');

  const validateForm = (): boolean => {
    const newErrors: Partial<Record<keyof CreateStandupDto, string>> = {};

    if (!formData.standupDate) {
      newErrors.standupDate = 'Standup date is required';
    }

    if (!formData.discussionPoints.trim()) {
      newErrors.discussionPoints = 'Discussion points is required';
    }

    if (!formData.todayPlan.trim()) {
      newErrors.todayPlan = "Today's plan is required";
    }

    if (!formData.blockers.trim()) {
      newErrors.blockers = 'Blockers field is required';
    }

    if (!formData.targets.trim()) {
      newErrors.targets = 'Targets is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setSubmitError('');
    onSubmitting?.();

    try {
      const payload: CreateStandupDto = {
        ...formData,
        notes: formData.notes?.trim() || undefined,
      };
      
      if (mode === 'edit') {
        if (!standupId) {
          throw new Error('Standup ID is required for editing');
        }
        const updatedStandup = await standupService.updateStandup(standupId, payload);
        onSuccess?.(updatedStandup);
      } else {
        const createdStandup = await standupService.createStandup(payload);
        onSuccess?.(createdStandup);
      }
    } catch (error) {
      console.error('Form submission error:', error);
      const message =
        error instanceof Error
          ? error.message
          : mode === 'edit'
            ? 'Failed to update standup'
            : 'Failed to create standup';
      setSubmitError(message);
      onError?.(message);
    }
  };

  const handleChange = (field: keyof CreateStandupDto, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
    
    // Clear error for this field
    if (errors[field]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="form-section">
      {submitError && (
        <div className="alert alert-danger" role="alert">
          {submitError}
        </div>
      )}

      {/* Standup Date */}
      <div className="mb-3">
        <label htmlFor="standupDate" className="form-label fw-semibold">
          Standup Date <span className="text-danger">*</span>
        </label>
        <input
          type="date"
          className={`form-control ${errors.standupDate ? 'is-invalid' : ''}`}
          id="standupDate"
          value={formData.standupDate}
          onChange={(e) => handleChange('standupDate', e.target.value)}
          disabled={isLoading}
        />
        {errors.standupDate && <div className="invalid-feedback">{errors.standupDate}</div>}
        <div className="form-text">The date for this standup entry</div>
      </div>

      {/* Discussion Points */}
      <div className="mb-3">
        <label htmlFor="discussionPoints" className="form-label fw-semibold">
          Discussion Points <span className="text-danger">*</span>
        </label>
        <textarea
          className={`form-control ${errors.discussionPoints ? 'is-invalid' : ''}`}
          id="discussionPoints"
          rows={4}
          placeholder="What topics were discussed in the standup meeting?"
          value={formData.discussionPoints}
          onChange={(e) => handleChange('discussionPoints', e.target.value)}
          disabled={isLoading}
        />
        {errors.discussionPoints && <div className="invalid-feedback">{errors.discussionPoints}</div>}
      </div>

      {/* Today's Plan */}
      <div className="mb-3">
        <label htmlFor="todayPlan" className="form-label fw-semibold">
          Today's Plan <span className="text-danger">*</span>
        </label>
        <textarea
          className={`form-control ${errors.todayPlan ? 'is-invalid' : ''}`}
          id="todayPlan"
          rows={4}
          placeholder="What do you plan to accomplish today?"
          value={formData.todayPlan}
          onChange={(e) => handleChange('todayPlan', e.target.value)}
          disabled={isLoading}
        />
        {errors.todayPlan && <div className="invalid-feedback">{errors.todayPlan}</div>}
      </div>

      {/* Blockers */}
      <div className="mb-3">
        <label htmlFor="blockers" className="form-label fw-semibold">
          Blockers <span className="text-danger">*</span>
        </label>
        <textarea
          className={`form-control ${errors.blockers ? 'is-invalid' : ''}`}
          id="blockers"
          rows={3}
          placeholder="Any blockers or impediments? (Enter 'None' if there are no blockers)"
          value={formData.blockers}
          onChange={(e) => handleChange('blockers', e.target.value)}
          disabled={isLoading}
        />
        {errors.blockers && <div className="invalid-feedback">{errors.blockers}</div>}
      </div>

      {/* Targets */}
      <div className="mb-3">
        <label htmlFor="targets" className="form-label fw-semibold">
          Targets <span className="text-danger">*</span>
        </label>
        <textarea
          className={`form-control ${errors.targets ? 'is-invalid' : ''}`}
          id="targets"
          rows={3}
          placeholder="What are your targets for today?"
          value={formData.targets}
          onChange={(e) => handleChange('targets', e.target.value)}
          disabled={isLoading}
        />
        {errors.targets && <div className="invalid-feedback">{errors.targets}</div>}
      </div>

      {/* Notes */}
      <div className="mb-3">
        <label htmlFor="notes" className="form-label fw-semibold">
          Notes
        </label>
        <textarea
          className="form-control"
          id="notes"
          rows={3}
          placeholder="Any additional notes or reminders? (Optional)"
          value={formData.notes}
          onChange={(e) => handleChange('notes', e.target.value)}
          disabled={isLoading}
        />
        <div className="form-text">Add any additional notes or reminders for future reference.</div>
      </div>

      {/* Submit Button */}
      <div className="d-flex gap-2 flex-wrap">
        <button
          type="submit"
          className="btn btn-primary"
          disabled={isLoading}
        >
          {isLoading ? (
            <>
              <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
              {mode === 'edit' ? 'Updating...' : 'Saving...'}
            </>
          ) : (
            mode === 'edit' ? 'Update Standup' : 'Save Standup'
          )}
        </button>
        <button
          type="button"
          className="btn btn-outline-secondary"
          onClick={() => {
            setFormData({
              standupDate: new Date().toISOString().split('T')[0],
              discussionPoints: '',
              todayPlan: '',
              blockers: '',
              targets: '',
              notes: '',
            });
            setErrors({});
          }}
          disabled={isLoading}
        >
          Clear Form
        </button>
      </div>
    </form>
  );
}
