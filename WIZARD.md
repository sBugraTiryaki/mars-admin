# Project Creation Wizard - Draft System

## Overview

8-step wizard with draft save functionality, similar to TikTok/Instagram drafts.

## User Flow

1. User starts creating project
2. User can save draft at any step (manual button)
3. Auto-save triggers when user changes steps (only for existing drafts)
4. Drafts appear at top of /projects page in grid view
5. User can continue, publish, or delete drafts
6. Maximum 10 drafts per user

## Technical Implementation

### Database

**Table**: `projects` (existing table with new columns)

**New Columns**:
- `is_draft` (boolean, default: false) - Draft/published flag
- `current_step` (tinyint, nullable) - Step user was on (1-8)
- `created_by` (unsignedBigInteger, foreign key to users.id, nullable) - Draft owner

**Index**: Composite index on `(is_draft, created_by)` for fast queries

### Media Collections

**Draft Images**:
- `draft_hero` - Hero images for drafts
- `draft_gallery` - Gallery images for drafts

**Published Images**:
- `hero` - Production hero images
- `gallery` - Production gallery images

**On Publish**: Images are moved from draft collections to production collections using Spatie Media Library's `move()` method.

### Validation Strategy

**Two Form Requests**:

1. **SaveDraftRequest** (Relaxed):
   - Only `current_step` is required
   - All other fields are nullable
   - Enforces 10 draft limit
   - Used for draft save/update

2. **StoreProjectRequest** (Strict):
   - All required fields enforced
   - Used for final publish
   - If validation fails, project stays as draft

### Auto-Save Behavior

**Triggers**:
- When user navigates to next/previous step
- Only if draft already exists (doesn't create new drafts)

**Indicator**:
- Google Docs style subtle indicator
- Shows: "Kaydediliyor..." (saving), "✓ Kaydedildi" (saved), "Kaydedilmemiş değişiklikler" (unsaved)

**Manual Save**:
- Always available via button
- Creates new draft or updates existing

## Wizard Steps

1. **Temel Bilgiler** - Basic project info, name, descriptions
2. **Konum** - Location details (country, city, address)
3. **Detaylar** - Project details (citizenship, guarantees, types, payment)
4. **Fiyatlandırma** - Pricing, currency, status, dates
5. **Özellikler** - Amenities (key-value pairs)
6. **Görseller** - Images (hero 16:9, gallery 4:3)
7. **Üniteler** - Units with full details
8. **İnceleme** - Review summary before publish

## API Endpoints

```php
// Draft operations
POST   /projects/drafts                 - Save new draft (manual)
PUT    /projects/drafts/{project}       - Update existing draft (auto-save & manual)
POST   /projects/drafts/{project}/publish - Publish draft (validates & moves images)
GET    /projects/drafts/{project}/load  - Load draft for editing
DELETE /projects/{project}              - Delete draft or project

// Regular project operations (unchanged)
GET    /projects                        - List projects + user's drafts
POST   /projects                        - Create project (non-draft)
GET    /projects/{project}              - Show project
PUT    /projects/{project}              - Update project
```

## Frontend Components

### DraftCard Component

Located in: `resources/js/pages/projects/index.tsx`

**Features**:
- Draft preview image (draft_hero_images[0])
- Project name or "İsimsiz Proje"
- Current step indicator (e.g., "2/8 - Konum")
- Progress bar showing completion
- "Devam Et" button to continue editing
- Delete button with confirmation modal

### DraftLoadModal

**Trigger**: Click "Devam Et" on draft card

**Shows**:
- Draft name
- Location/city
- Current step
- Confirmation buttons (İptal, Devam Et)

**Action**: Redirects to `/projects/drafts/{id}/load` which loads create page with draft data

### DeleteConfirmModal

**Trigger**: Click trash icon on draft card

**Shows**: "Are you sure you want to delete this draft?"

**Action**: Hard deletes draft and all associated images

### Auto-Save Indicator

Located in: `resources/js/pages/projects/create.tsx` header

**States**:
- 🔄 "Kaydediliyor..." - Saving in progress
- ✓ "Kaydedildi • 2 dakika önce" - Saved successfully
- ⚠ "Kaydedilmemiş değişiklikler" - Unsaved changes detected

### Save Draft Button

- Always visible in header
- Text: "Taslak Olarak Kaydet" (new draft) or "Kaydet" (existing draft)
- Disabled while auto-save is running
- Creates new draft or updates existing

## Data Flow

### Creating a New Draft

1. User fills out step 1 (or more)
2. User clicks "Taslak Olarak Kaydet"
3. Frontend sends POST to `/projects/drafts` with:
   - `current_step`
   - All filled fields up to current step
   - Images as multipart files
   - Units/amenities as JSON strings
4. Backend creates project with `is_draft=true`
5. Images saved to `draft_hero` and `draft_gallery` collections
6. User redirected to `/projects` with success message
7. Draft appears in grid at top

### Loading a Draft

1. User clicks "Devam Et" on draft card
2. Confirmation modal shows
3. User confirms
4. GET `/projects/drafts/{id}/load` called
5. Backend loads project with units, amenities, translations, images
6. Frontend initialized with draft data at saved step
7. User can continue editing

### Auto-Saving a Draft

1. User navigates from step N to step N+1
2. `useEffect` detects `currentStep` change
3. If `draft` exists (not new project), trigger auto-save
4. Frontend sends PUT to `/projects/drafts/{id}` with:
   - `current_step` (updated)
   - All form data
   - Preserves scroll position and state
5. Backend updates draft
6. Success callback sets `lastSavedAt` timestamp
7. Indicator shows "✓ Kaydedildi • just now"

### Publishing a Draft

1. User completes all 8 steps
2. User clicks "Projeyi Yayınla" on review step
3. Frontend sends POST to `/projects/drafts/{id}/publish`
4. Backend validates using `StoreProjectRequest` (strict)
5. If validation passes:
   - Move images from draft collections to production
   - Set `is_draft=false`, `current_step=null`
   - Redirect to project show page
6. If validation fails:
   - Return errors
   - Draft remains as draft
   - User must fix errors and try again

### Deleting a Draft

1. User clicks trash icon on draft card
2. Confirmation modal shows
3. User confirms
4. Frontend sends DELETE to `/projects/{id}`
5. Backend deletes project
6. Spatie Media Library automatically deletes associated images
7. Draft removed from grid

## Model Scopes

```php
// Get all drafts
Project::drafts()->get();

// Get all published projects
Project::published()->get();

// Get current user's drafts
Project::myDrafts(auth()->id())->get();
```

## Best Practices

### For Developers

1. **Always validate before publish** - Use strict `StoreProjectRequest` validation
2. **Check draft limit** - Enforce max 10 drafts in backend and frontend
3. **Move images on publish** - Never copy, always move to avoid duplicates
4. **Use scopes** - Always use `published()` scope for public project lists
5. **Preserve state** - Auto-save should use `preserveScroll: true` and `preserveState: true`
6. **Handle race conditions** - Disable auto-save while another save is in progress

### For Users

1. **Save early, save often** - Use manual save button frequently
2. **Auto-save is a backup** - Don't rely solely on auto-save, use manual save
3. **Complete all steps before publish** - Publishing requires all required fields
4. **Delete old drafts** - Stay under 10 draft limit
5. **Images are preserved** - Draft images are kept until draft is deleted or published

## Edge Cases Handled

### 1. User Navigates Away Without Saving

**Solution**: Browser warning if:
- Changes exist
- No draft exists (if draft exists, auto-save handles it)

```typescript
window.addEventListener('beforeunload', (e) => {
    if (hasUnsavedChanges && !draft) {
        e.preventDefault();
        e.returnValue = 'Unsaved changes warning';
    }
});
```

### 2. Draft Limit Reached (10/10)

**Backend**: Validation error in `SaveDraftRequest`
**Frontend**: Warning alert + disabled "Save Draft" button

### 3. Incomplete Draft Publish

**Solution**: Validation fails, errors shown, draft stays as draft

### 4. Existing Images + New Images

**Solution**: Track existing image URLs separately, append new files

### 5. Multiple Tabs Editing Same Draft

**Current**: Last-write-wins
**Future**: Conflict detection with version numbers

### 6. Slug Uniqueness

**Solution**: Auto-generate unique slug with `uniqid()` for drafts
```php
$slug = Str::slug($name) . '-draft-' . uniqid();
```

## Testing Checklist

### Feature Tests (`tests/Feature/ProjectDraftTest.php`)

- ✅ Can save a new draft
- ✅ Can update existing draft
- ✅ Enforces 10 draft limit
- ✅ Can publish complete draft
- ✅ Cannot publish incomplete draft
- ✅ Deletes draft with images
- ✅ Images move from draft to production on publish

### Model Tests (`tests/Unit/ProjectModelTest.php`)

- ✅ `drafts()` scope returns only drafts
- ✅ `published()` scope returns only published
- ✅ `myDrafts($userId)` scope returns user's drafts

### Browser Tests (Optional - `tests/Browser/ProjectDraftWorkflowTest.php`)

- ✅ Full workflow: create → save → load → edit → publish
- ✅ Auto-save triggers on step change
- ✅ Draft deletion with confirmation

## Performance Considerations

1. **Composite Index**: `(is_draft, created_by)` speeds up draft queries
2. **Limit Queries**: Only fetch 10 drafts per user
3. **Eager Loading**: Load relationships (`units`, `amenities`, `translations`) in one query
4. **Debouncing**: Auto-save uses step changes, not input changes (no throttling needed)
5. **Image Optimization**: Spatie conversions (thumb, preview, large) happen async

## Future Enhancements

### 1. Debounced Auto-Save (30 seconds)

Add typing-based auto-save in addition to step-based:

```typescript
useEffect(() => {
    if (!draft) return;

    const timeout = setTimeout(() => {
        handleAutoSave();
    }, 30000); // 30 seconds

    return () => clearTimeout(timeout);
}, [projectData, units, amenities]);
```

### 2. Draft Versioning

- Keep history of draft changes
- Allow rollback to previous versions
- Show diff between versions

### 3. Conflict Detection

- Add `updated_at` version check
- Warn if draft modified in another tab
- Merge conflicts UI

### 4. Draft Sharing

- Share drafts between team members
- Add collaborator permissions
- Track who edited what

### 5. Analytics

- Track draft → publish conversion rate
- Average time from draft creation to publish
- Most common abandonment steps

## Troubleshooting

### Draft Not Saving

1. Check browser console for errors
2. Verify `is_draft` column exists in database
3. Check draft limit (max 10)
4. Verify user is authenticated

### Auto-Save Not Working

1. Confirm draft already exists (auto-save doesn't create new drafts)
2. Check `currentStep` is changing
3. Verify `isSavingDraft` is not stuck at `true`
4. Check network tab for failed requests

### Images Not Appearing

1. Verify images saved to correct collection (`draft_hero` vs `hero`)
2. Check file permissions on storage disk
3. Run `php artisan storage:link` if needed
4. Check Media Library configuration

### Publish Validation Failing

1. Review validation errors in response
2. Complete all required fields
3. Verify images are uploaded
4. Check `StoreProjectRequest` rules match form

## File Locations

### Backend
- Migration: `database/migrations/*_add_draft_fields_to_projects_table.php`
- Model: `app/Models/Project.php`
- Controller: `app/Http/Controllers/ProjectController.php`
- Form Request: `app/Http/Requests/SaveDraftRequest.php`
- Routes: `routes/web.php`

### Frontend
- Types: `resources/js/types/index.ts` or `resources/js/pages/projects/types.ts`
- Index Page: `resources/js/pages/projects/index.tsx`
- Create Page: `resources/js/pages/projects/create.tsx`

### Tests
- Feature: `tests/Feature/ProjectDraftTest.php`
- Unit: `tests/Unit/ProjectModelTest.php`
- Browser: `tests/Browser/ProjectDraftWorkflowTest.php`

## Support

For questions or issues with the draft system, refer to:
- Full implementation plan: `/Users/bugratiryaki/.claude/plans/humble-frolicking-pnueli.md`
- Laravel Media Library docs: https://spatie.be/docs/laravel-medialibrary
- Inertia.js v2 docs: https://inertiajs.com

---

**Last Updated**: 2025-11-26
**Version**: 1.0
**Status**: Implementation Plan
