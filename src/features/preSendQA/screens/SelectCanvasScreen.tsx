import { CanvasList } from "../components/CanvasList";
import { useAppDispatch, useAppSelector } from "../../../store/hooks";
import { setSelectedCanvas } from "../store/preSendQASlice";
import { selectSelectedCanvas } from "../store/selectors";

export function SelectCanvasScreen() {
  const dispatch = useAppDispatch();
  const selectedCanvas = useAppSelector(selectSelectedCanvas);

  return (
    <div>
      <h2 className="font-serif text-2xl font-semibold text-app-ink">Select the canvas to validate</h2>
      <p className="mt-1 text-sm leading-6 text-app-soft">
        Braze canvases and campaigns are mocked for this frontend prototype.
      </p>
      <div className="mt-5">
        <CanvasList selectedCanvasId={selectedCanvas?.id ?? null} onSelect={(canvas) => dispatch(setSelectedCanvas(canvas))} />
      </div>
    </div>
  );
}
