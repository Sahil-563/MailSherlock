import { FieldChip } from "../components/FieldChip";
import { useAppSelector } from "../../../store/hooks";
import { selectExtractedFields } from "../store/selectors";

export function ReviewFieldsScreen() {
  const extractedFields = useAppSelector(selectExtractedFields);

  return (
    <div>
      <h2 className="font-serif text-2xl font-semibold text-app-ink">Review what the message actually needs</h2>
      <p className="mt-1 text-sm leading-6 text-app-soft">Merge fields extracted from the raw, unrendered Liquid.</p>
      <div className="mt-5 flex flex-wrap gap-2">
        {extractedFields.map((field) => (
          <FieldChip key={field.id} field={field} />
        ))}
      </div>
      <p className="mt-4 text-sm text-app-faint">
        connected_content.offer_code is a live API call - flagged, not validated in MVP v1.
      </p>
    </div>
  );
}
