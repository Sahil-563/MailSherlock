import { MessageGraph } from "../components/MessageGraph";
import { useAppDispatch, useAppSelector } from "../../../store/hooks";
import { setSelectedMessage } from "../store/preSendQASlice";
import { selectSelectedMessage } from "../store/selectors";

export function SelectMessageScreen() {
  const dispatch = useAppDispatch();
  const selectedMessage = useAppSelector(selectSelectedMessage);

  return (
    <div>
      <h2 className="font-serif text-2xl font-semibold text-app-ink">Pick the exact message to test</h2>
      <p className="mt-1 text-sm leading-6 text-app-soft">
        One step can bundle several channels. Click the Email step to select it.
      </p>
      <div className="mt-6">
        <MessageGraph
          selectedMessageId={selectedMessage?.id ?? null}
          onSelect={(message) => dispatch(setSelectedMessage(message))}
        />
      </div>
    </div>
  );
}
