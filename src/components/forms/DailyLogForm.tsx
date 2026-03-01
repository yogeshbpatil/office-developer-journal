'use client';

import { useEffect, useState, FormEvent } from 'react';
import { CreateDailyLogDto, DailyLog } from '@/models/DailyLog';
import { dailyLogService } from '@/services/dailylog-service';

interface DailyLogFormProps {
  initialData?: Partial<CreateDailyLogDto>;
  mode?: 'create' | 'edit';
  logId?: string;
  isLoading?: boolean;
  onSubmitting?: () => void;
  onSuccess?: (createdLog: DailyLog) => void;
  onError?: (message: string) => void;
}

export default function DailyLogForm({
  initialData,
  mode = 'create',
  logId,
  isLoading = false,
  onSubmitting,
  onSuccess,
  onError,
}: DailyLogFormProps) {
  const [formData, setFormData] = useState<CreateDailyLogDto>({
    logDate: initialData?.logDate || new Date().toISOString().split('T')[0],
    tasksWorked: initialData?.tasksWorked || '',
    problemsFaced: initialData?.problemsFaced || '',
    solutions: initialData?.solutions || '',
    learnings: initialData?.learnings || '',
    tips: initialData?.tips || '',
    gitLink: initialData?.gitLink || '',
  });

  useEffect(() => {
    setFormData({
      logDate: initialData?.logDate || new Date().toISOString().split('T')[0],
      tasksWorked: initialData?.tasksWorked || '',
      problemsFaced: initialData?.problemsFaced || '',
      solutions: initialData?.solutions || '',
      learnings: initialData?.learnings || '',
      tips: initialData?.tips || '',
      gitLink: initialData?.gitLink || '',
    });
    setErrors({});
    setSubmitError('');
  }, [initialData]);

  const [errors, setErrors] = useState<Partial<Record<keyof CreateDailyLogDto, string>>>({});
  const [submitError, setSubmitError] = useState('');

  const validateForm = (): boolean => {
    const newErrors: Partial<Record<keyof CreateDailyLogDto, string>> = {};

    if (!formData.logDate) {
      newErrors.logDate = 'Log date is required';
    }

    if (!formData.tasksWorked.trim()) {
      newErrors.tasksWorked = 'Tasks worked is required';
    }

    if (!formData.problemsFaced.trim()) {
      newErrors.problemsFaced = 'Problems faced is required';
    }

    if (!formData.solutions.trim()) {
      newErrors.solutions = 'Solutions is required';
    }

    if (!formData.learnings.trim()) {
      newErrors.learnings = 'Learnings is required';
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
      const payload: CreateDailyLogDto = {
        ...formData,
        tips: formData.tips.trim(),
        gitLink: formData.gitLink?.trim() || undefined,
      };
      if (mode === 'edit') {
        if (!logId) {
          throw new Error('Log ID is required for editing');
        }
        const updatedLog = await dailyLogService.updateLog(logId, payload);
        onSuccess?.(updatedLog);
      } else {
        const createdLog = await dailyLogService.createLog(payload);
        onSuccess?.(createdLog);
      }
    } catch (error) {
      console.error('Form submission error:', error);
      const message =
        error instanceof Error
          ? error.message
          : mode === 'edit'
            ? 'Failed to update daily log'
            : 'Failed to create daily log';
      setSubmitError(message);
      onError?.(message);
    }
  };

  const handleChange = (field: keyof CreateDailyLogDto, value: string) => {
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

      {/* Log Date */}
      <div className="mb-3">
        <label htmlFor="logDate" className="form-label fw-semibold">
          Log Date <span className="text-danger">*</span>
        </label>
        <input
          type="date"
          className={`form-control ${errors.logDate ? 'is-invalid' : ''}`}
          id="logDate"
          value={formData.logDate}
          onChange={(e) => handleChange('logDate', e.target.value)}
          disabled={isLoading}
          max={new Date().toISOString().split('T')[0]}
        />
        {errors.logDate && <div className="invalid-feedback">{errors.logDate}</div>}
      </div>

      {/* Tasks Worked */}
      <div className="mb-3">
        <label htmlFor="tasksWorked" className="form-label fw-semibold">
          Tasks Worked <span className="text-danger">*</span>
        </label>
        <textarea
          className={`form-control ${errors.tasksWorked ? 'is-invalid' : ''}`}
          id="tasksWorked"
          rows={4}
          placeholder="Describe the tasks you worked on today..."
          value={formData.tasksWorked}
          onChange={(e) => handleChange('tasksWorked', e.target.value)}
          disabled={isLoading}
        />
        {errors.tasksWorked && <div className="invalid-feedback">{errors.tasksWorked}</div>}
      </div>

      {/* Problems Faced */}
      <div className="mb-3">
        <label htmlFor="problemsFaced" className="form-label fw-semibold">
          Problems Faced <span className="text-danger">*</span>
        </label>
        <textarea
          className={`form-control ${errors.problemsFaced ? 'is-invalid' : ''}`}
          id="problemsFaced"
          rows={4}
          placeholder="What challenges or issues did you encounter?"
          value={formData.problemsFaced}
          onChange={(e) => handleChange('problemsFaced', e.target.value)}
          disabled={isLoading}
        />
        {errors.problemsFaced && <div className="invalid-feedback">{errors.problemsFaced}</div>}
      </div>

      {/* Solutions */}
      <div className="mb-3">
        <label htmlFor="solutions" className="form-label fw-semibold">
          Solutions <span className="text-danger">*</span>
        </label>
        <textarea
          className={`form-control ${errors.solutions ? 'is-invalid' : ''}`}
          id="solutions"
          rows={4}
          placeholder="How did you solve the problems?"
          value={formData.solutions}
          onChange={(e) => handleChange('solutions', e.target.value)}
          disabled={isLoading}
        />
        {errors.solutions && <div className="invalid-feedback">{errors.solutions}</div>}
      </div>

      {/* Learnings */}
      <div className="mb-3">
        <label htmlFor="learnings" className="form-label fw-semibold">
          Learnings <span className="text-danger">*</span>
        </label>
        <textarea
          className={`form-control ${errors.learnings ? 'is-invalid' : ''}`}
          id="learnings"
          rows={4}
          placeholder="What did you learn today?"
          value={formData.learnings}
          onChange={(e) => handleChange('learnings', e.target.value)}
          disabled={isLoading}
        />
        {errors.learnings && <div className="invalid-feedback">{errors.learnings}</div>}
      </div>

      {/* Tips */}
      <div className="mb-3">
        <label htmlFor="tips" className="form-label fw-semibold">
          Tips & Best Practices
        </label>
        <textarea
          className="form-control"
          id="tips"
          rows={3}
          placeholder="Any tips or best practices to share? (Optional)"
          value={formData.tips}
          onChange={(e) => handleChange('tips', e.target.value)}
          disabled={isLoading}
        />
        <div className="form-text">Share any helpful tips or recommendations for future reference.</div>
      </div>

      {/* Git Link */}
      <div className="mb-3">
        <label htmlFor="gitLink" className="form-label fw-semibold">
          Git Link
        </label>
        <input
          type="url"
          className="form-control"
          id="gitLink"
          placeholder="https://github.com/username/repo/commit/abc123 (Optional)"
          value={formData.gitLink}
          onChange={(e) => handleChange('gitLink', e.target.value)}
          disabled={isLoading}
        />
        <div className="form-text">Add a link to your Git repository, commit, or pull request for future reference.</div>
      </div>

      {/* Submit Button */}
      <div className="d-flex gap-2">
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
            mode === 'edit' ? 'Update' : 'Save Daily Log'
          )}
        </button>
        <button
          type="button"
          className="btn btn-outline-secondary"
          onClick={() => {
            setFormData({
              logDate: new Date().toISOString().split('T')[0],
              tasksWorked: '',
              problemsFaced: '',
              solutions: '',
              learnings: '',
              tips: '',
              gitLink: '',
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
