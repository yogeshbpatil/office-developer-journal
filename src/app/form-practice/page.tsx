'use client';

import { FormEvent, useEffect, useRef, useState } from 'react';
import ProtectedLayout from '@/components/layouts/ProtectedLayout';
import { getCurrentUser } from '@/lib/auth';
import { PracticeEntry, PracticeEntryInput } from '@/models/PracticeEntry';
import { practiceEntryService } from '@/services/practice-entry-service';

type PracticeForm = Omit<PracticeEntryInput, 'hours'> & { hours: string };

const emptyForm: PracticeForm = {
  title: '',
  hours: '',
  reference: '',
  description: '',
  category: '',
  assignee: '',
  completed: false,
  dueDate: '',
  fileName: '',
  rating: 0,
};

const categories = ['Development', 'Design', 'Testing', 'Documentation', 'Other'];
const assignees = ['Alex', 'Sam', 'Taylor', 'Jordan'];

export default function FormPracticePage() {
  const [userId, setUserId] = useState('');
  const [entries, setEntries] = useState<PracticeEntry[]>([]);
  const [form, setForm] = useState<PracticeForm>({ ...emptyForm });
  const [editingId, setEditingId] = useState<string | null>(null);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [listSearch, setListSearch] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const fileInput = useRef<HTMLInputElement>(null);
  const formHeading = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      const id = getCurrentUser()?.id;
      if (!id) return;
      setUserId(id);
      try {
        setEntries(practiceEntryService.list(id));
      } catch {
        setError('Could not load practice entries from this browser.');
      }
    }, 0);
    return () => window.clearTimeout(timeoutId);
  }, []);

  const visibleEntries = entries.filter((entry) =>
    [entry.title, entry.reference, entry.description, entry.category, entry.assignee]
      .some((value) => value.toLowerCase().includes(listSearch.toLowerCase().trim()))
  );
  const allVisibleSelected = visibleEntries.length > 0 &&
    visibleEntries.every((entry) => selectedIds.has(entry.id));

  function updateField<K extends keyof PracticeForm>(field: K, value: PracticeForm[K]) {
    setForm((current) => ({ ...current, [field]: value }));
    setError('');
  }

  function clearForm() {
    setForm({ ...emptyForm });
    setEditingId(null);
    if (fileInput.current) fileInput.current.value = '';
    setError('');
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage('');
    if (!userId) {
      setError('Please sign in again before saving an entry.');
      return;
    }
    const hours = Number(form.hours);
    if (!form.title.trim() || !form.dueDate || !form.category || !form.hours.trim() ||
        !Number.isFinite(hours) || hours < 0 || hours > 100 || form.rating < 1) {
      setError('Complete the required fields and choose a rating from 1 to 5.');
      return;
    }
    const input: PracticeEntryInput = {
      ...form,
      title: form.title.trim(),
      hours,
      reference: form.reference.trim(),
      description: form.description.trim(),
      assignee: form.assignee.trim(),
    };
    try {
      if (editingId) {
        const updated = practiceEntryService.update(userId, editingId, input);
        setEntries((current) => current.map((entry) => entry.id === editingId ? updated : entry));
        setMessage('Entry updated.');
      } else {
        const created = practiceEntryService.create(userId, input);
        setEntries((current) => [created, ...current]);
        setMessage('Entry saved to the list.');
      }
      clearForm();
    } catch {
      setError('Could not save the entry in this browser.');
    }
  }

  function editEntry(entry: PracticeEntry) {
    setForm({
      title: entry.title,
      hours: String(entry.hours),
      reference: entry.reference,
      description: entry.description,
      category: entry.category,
      assignee: entry.assignee,
      completed: entry.completed,
      dueDate: entry.dueDate,
      fileName: entry.fileName,
      rating: entry.rating,
    });
    setEditingId(entry.id);
    setMessage('');
    setError('');
    if (fileInput.current) fileInput.current.value = '';
    formHeading.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  function deleteEntries(ids: string[]) {
    if (!userId || ids.length === 0) return;
    if (!window.confirm(ids.length === 1 ? 'Delete this entry?' : 'Delete ' + ids.length + ' selected entries?')) return;
    try {
      practiceEntryService.delete(userId, ids);
      const removed = new Set(ids);
      setEntries((current) => current.filter((entry) => !removed.has(entry.id)));
      setSelectedIds(new Set());
      if (editingId && removed.has(editingId)) clearForm();
      setMessage(ids.length === 1 ? 'Entry deleted.' : ids.length + ' entries deleted.');
      setError('');
    } catch {
      setError('Could not delete the selected entries.');
    }
  }

  function toggleSelected(id: string) {
    setSelectedIds((current) => {
      const next = new Set(current);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  function toggleAllVisible() {
    setSelectedIds((current) => {
      const next = new Set(current);
      visibleEntries.forEach((entry) => {
        if (allVisibleSelected) next.delete(entry.id);
        else next.add(entry.id);
      });
      return next;
    });
  }

  return (
    <ProtectedLayout>
      <div className="container py-3 pb-5">
        <div className="mb-4">
          <h1 className="heading-1 mb-2">Form Practice</h1>
          <p className="text-muted mb-0">Try common form controls, then create, edit, and delete practice entries.</p>
        </div>

        {message && <div className="alert alert-success" role="status">{message}</div>}
        {error && <div className="alert alert-danger" role="alert">{error}</div>}

        <section className="form-section" aria-labelledby="practice-form-heading">
          <h2 id="practice-form-heading" ref={formHeading} className="heading-3 mb-3">
            {editingId ? 'Edit entry' : 'Create an entry'}
          </h2>
          <form onSubmit={handleSubmit}>
            <div className="row g-3">
              <div className="col-md-6">
                <label htmlFor="practice-title" className="form-label fw-semibold">Text input: title *</label>
                <input id="practice-title" className="form-control" type="text" maxLength={120}
                  value={form.title} onChange={(event) => updateField('title', event.target.value)}
                  placeholder="e.g. Review a pull request" required />
              </div>
              <div className="col-md-6">
                <label htmlFor="practice-hours" className="form-label fw-semibold">Number input: hours *</label>
                <input id="practice-hours" className="form-control" type="number" min="0" max="100" step="0.5"
                  value={form.hours} onChange={(event) => updateField('hours', event.target.value)}
                  placeholder="e.g. 2.5" required />
              </div>
              <div className="col-md-6">
                <label htmlFor="practice-reference" className="form-label fw-semibold">Search input: reference keyword</label>
                <input id="practice-reference" className="form-control" type="search" maxLength={100}
                  value={form.reference} onChange={(event) => updateField('reference', event.target.value)}
                  placeholder="e.g. dashboard" />
                <div className="form-text">This keyword is searchable in the list below.</div>
              </div>
              <div className="col-md-6">
                <label htmlFor="practice-category" className="form-label fw-semibold">Select: category *</label>
                <select id="practice-category" className="form-select" value={form.category}
                  onChange={(event) => updateField('category', event.target.value)} required>
                  <option value="">Choose a category</option>
                  {categories.map((category) => <option key={category} value={category}>{category}</option>)}
                </select>
              </div>
              <div className="col-12">
                <label htmlFor="practice-description" className="form-label fw-semibold">Text area: description</label>
                <textarea id="practice-description" className="form-control" rows={3} maxLength={1000}
                  value={form.description} onChange={(event) => updateField('description', event.target.value)}
                  placeholder="Write details about this entry..." />
              </div>
              <div className="col-md-6">
                <label htmlFor="practice-assignee" className="form-label fw-semibold">Autocomplete: assignee</label>
                <input id="practice-assignee" className="form-control" type="text" list="practice-assignees"
                  maxLength={80} value={form.assignee}
                  onChange={(event) => updateField('assignee', event.target.value)}
                  placeholder="Start typing a name" autoComplete="off" />
                <datalist id="practice-assignees">
                  {assignees.map((name) => <option key={name} value={name} />)}
                </datalist>
              </div>
              <div className="col-md-6">
                <label htmlFor="practice-due-date" className="form-label fw-semibold">Date picker: due date *</label>
                <input id="practice-due-date" className="form-control" type="date" value={form.dueDate}
                  onChange={(event) => updateField('dueDate', event.target.value)} required />
              </div>
              <div className="col-md-6">
                <label htmlFor="practice-file" className="form-label fw-semibold">File upload: attachment</label>
                <input id="practice-file" ref={fileInput} className="form-control" type="file"
                  onChange={(event) => updateField('fileName', event.target.files?.[0]?.name ?? '')} />
                <div className="form-text">Practice mode saves the filename only, not the file contents.</div>
                {form.fileName && (
                  <div className="small mt-1">
                    Selected: {form.fileName}{' '}
                    <button type="button" className="btn btn-link btn-sm p-0" onClick={() => {
                      updateField('fileName', '');
                      if (fileInput.current) fileInput.current.value = '';
                    }}>Remove</button>
                  </div>
                )}
              </div>
              <div className="col-md-6">
                <label className="form-label fw-semibold d-block">Rating *</label>
                <div role="group" aria-label="Rating from 1 to 5" className="d-flex gap-1">
                  {[1, 2, 3, 4, 5].map((value) => (
                    <button key={value} type="button" aria-label={value + ' stars'}
                      aria-pressed={form.rating === value}
                      className={form.rating >= value ? 'btn btn-warning' : 'btn btn-outline-secondary'}
                      onClick={() => updateField('rating', value)}>★</button>
                  ))}
                </div>
              </div>
              <div className="col-12">
                <div className="form-check">
                  <input id="practice-completed" className="form-check-input" type="checkbox"
                    checked={form.completed} onChange={(event) => updateField('completed', event.target.checked)} />
                  <label htmlFor="practice-completed" className="form-check-label">Checkbox: completed</label>
                </div>
              </div>
              <div className="col-12 d-flex gap-2 flex-wrap">
                <button className="btn btn-primary" type="submit">{editingId ? 'Save changes' : 'Save entry'}</button>
                <button className="btn btn-outline-secondary" type="button" onClick={clearForm}>
                  {editingId ? 'Cancel edit' : 'Clear form'}
                </button>
              </div>
            </div>
          </form>
        </section>

        <section aria-labelledby="practice-list-heading">
          <div className="d-flex justify-content-between align-items-center flex-wrap gap-2 mb-3">
            <div>
              <h2 id="practice-list-heading" className="heading-3 mb-0">Saved entries</h2>
              <span className="text-muted small">{entries.length} total</span>
            </div>
            <button type="button" className="btn btn-outline-danger btn-sm"
              disabled={selectedIds.size === 0} onClick={() => deleteEntries([...selectedIds])}>
              Delete selected ({selectedIds.size})
            </button>
          </div>
          <div className="mb-3">
            <label htmlFor="practice-list-search" className="form-label">Search saved entries</label>
            <input id="practice-list-search" className="form-control" type="search" value={listSearch}
              onChange={(event) => { setListSearch(event.target.value); setSelectedIds(new Set()); }}
              placeholder="Search title, keyword, description, category, or assignee" />
          </div>
          {visibleEntries.length === 0 ? (
            <div className="form-section text-center text-muted">
              {entries.length === 0 ? 'No entries yet. Save the form to create one.' : 'No entries match your search.'}
            </div>
          ) : (
            <div className="table-responsive bg-white rounded shadow-sm">
              <table className="table table-hover align-middle mb-0">
                <thead className="table-light">
                  <tr>
                    <th scope="col">
                      <input className="form-check-input" type="checkbox" aria-label="Select all visible entries"
                        checked={allVisibleSelected} onChange={toggleAllVisible} />
                    </th>
                    <th scope="col">Entry</th>
                    <th scope="col">Category</th>
                    <th scope="col">Hours</th>
                    <th scope="col">Due date</th>
                    <th scope="col">Rating</th>
                    <th scope="col">Status</th>
                    <th scope="col">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {visibleEntries.map((entry) => (
                    <tr key={entry.id}>
                      <td>
                        <input className="form-check-input" type="checkbox"
                          aria-label={'Select ' + entry.title} checked={selectedIds.has(entry.id)}
                          onChange={() => toggleSelected(entry.id)} />
                      </td>
                      <td>
                        <strong>{entry.title}</strong>
                        <div className="small text-muted">
                          {entry.assignee || 'Unassigned'}
                          {entry.reference && ' · ' + entry.reference}
                        </div>
                        {(entry.description || entry.fileName) && (
                          <details className="small mt-1">
                            <summary>Details</summary>
                            {entry.description && <div className="text-break">{entry.description}</div>}
                            {entry.fileName && <div className="text-break">Attachment name: {entry.fileName}</div>}
                          </details>
                        )}
                      </td>
                      <td>{entry.category}</td>
                      <td>{entry.hours}</td>
                      <td>{entry.dueDate}</td>
                      <td aria-label={entry.rating + ' out of 5 stars'}>{entry.rating} / 5</td>
                      <td><span className={entry.completed ? 'badge bg-success' : 'badge bg-secondary'}>
                        {entry.completed ? 'Completed' : 'Open'}
                      </span></td>
                      <td>
                        <div className="d-flex gap-2">
                          <button type="button" className="btn btn-outline-primary btn-sm" onClick={() => editEntry(entry)}>Edit</button>
                          <button type="button" className="btn btn-outline-danger btn-sm" onClick={() => deleteEntries([entry.id])}>Delete</button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </div>
    </ProtectedLayout>
  );
}
