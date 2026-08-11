import { CanvasList } from "../components/CanvasList";
import { useAppDispatch, useAppSelector } from "../../../store/hooks";
import { setScreen2Arrived, setSelectedCanvas } from "../store/preSendQASlice";
import { selectScreen2Arrived, selectSelectedCanvas } from "../store/selectors";
import { useEffect, useRef, useState } from "react";
import axios from "axios";
import { Button } from "../../../components/ui/Button";

export function SelectCanvasScreen() {
  const dispatch = useAppDispatch();
  const selectedCanvas = useAppSelector(selectSelectedCanvas);
  const screen2Arrived = useAppSelector(selectScreen2Arrived);
  const fetchAttemptedRef = useRef(false);
  const [isFetching, setIsFetching] = useState(false);
  const [fetchRequestId, setFetchRequestId] = useState(0);
  const [data, setData] = useState({
    canvas: {},
    campaigns: {},
  });

  useEffect(() => {
    if (screen2Arrived) {
      fetchAttemptedRef.current = false;
      return;
    }

    if (fetchAttemptedRef.current) {
      return;
    }

    const fetchData = async () => {
      fetchAttemptedRef.current = true;
      setIsFetching(true);

      try {
        const config = {
          headers: {
            Authorization: `Bearer ${import.meta.env.VITE_BRAZE_API_TOKEN}`,
          },
        };
        const [canvasResponse, campaignsResponse] = await Promise.all([
          axios.get("https://rest.iad-02.braze.com/canvas/list", config),
          axios.get("https://rest.iad-02.braze.com/campaigns/list", config),
        ]);

        setData({
          canvas: canvasResponse?.data?.canvases || {},
          campaigns: campaignsResponse?.data?.campaigns || {},
        });
        dispatch(setScreen2Arrived(true));
      } catch (error) {
        console.error("Error fetching Braze data:", error);
      } finally {
        setIsFetching(false);
      }
    };


    fetchData();

  }, [dispatch, fetchRequestId, screen2Arrived]);

  const handleFetchAgain = () => {
    fetchAttemptedRef.current = false;
    dispatch(setScreen2Arrived(false));
    setFetchRequestId((requestId) => requestId + 1);
  };

  return (
    <div>
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h2 className="font-serif text-2xl font-semibold text-app-ink">Select the canvas to validate</h2>
          <p className="mt-1 text-sm leading-6 text-app-soft">
            Braze canvases and campaigns are mocked for this frontend prototype.
          </p>
        </div>
        <Button disabled={isFetching} onClick={handleFetchAgain}>
          {isFetching ? "Fetching..." : "Fetch again"}
        </Button>
      </div>
      <div className="mt-5">
        <CanvasList selectedCanvasId={selectedCanvas?.id ?? null} onSelect={(canvas) => dispatch(setSelectedCanvas(canvas))} />
      </div>
    </div>
  );
}
