import numpy as np


class SimpleTracker:

    def __init__(
            self,
            max_lost=90,
            iou_thresh=0.22):

        self.next_id = 1
        self.tracks = {}
        self.max_lost = max_lost
        self.iou_thresh = iou_thresh

    def _iou(self, a, b):

        ax1, ay1, ax2, ay2 = a
        bx1, by1, bx2, by2 = b

        ix1 = max(ax1, bx1)
        iy1 = max(ay1, by1)
        ix2 = min(ax2, bx2)
        iy2 = min(ay2, by2)

        inter = max(0, ix2 - ix1) * max(0, iy2 - iy1)

        if inter == 0:
            return 0.0

        ua = (
            (ax2 - ax1) * (ay2 - ay1)
            + (bx2 - bx1) * (by2 - by1)
            - inter
        )

        return inter / ua if ua > 0 else 0.0

    def update(self, detections):

        matched_track_ids = set()
        matched_det_ids = set()

        results = []

        track_ids = list(self.tracks.keys())

        if track_ids and detections:

            iou_matrix = np.zeros(
                (len(track_ids), len(detections))
            )

            for ti, tid in enumerate(track_ids):

                for di, det in enumerate(detections):

                    iou_matrix[ti, di] = self._iou(
                        self.tracks[tid]["box"],
                        det[:4]
                    )

            flat = np.argsort(-iou_matrix.flatten())

            for idx in flat:

                ti = idx // len(detections)
                di = idx % len(detections)

                if ti >= len(track_ids):
                    continue

                if iou_matrix[ti, di] < self.iou_thresh:
                    break

                tid = track_ids[ti]

                if tid in matched_track_ids:
                    continue

                if di in matched_det_ids:
                    continue

                det = detections[di]

                self.tracks[tid].update({
                    "box": det[:4],
                    "conf": det[4],
                    "lost": 0
                })

                self.tracks[tid]["frames"] = (
                    self.tracks[tid].get("frames", 0) + 1
                )

                matched_track_ids.add(tid)
                matched_det_ids.add(di)

        for di, det in enumerate(detections):

            if di not in matched_det_ids:

                self.tracks[self.next_id] = {
                    "box": det[:4],
                    "conf": det[4],
                    "lost": 0,
                    "frames": 1
                }

                self.next_id += 1

        for tid in list(self.tracks.keys()):

            if tid not in matched_track_ids:

                self.tracks[tid]["lost"] += 1

                if self.tracks[tid]["lost"] > self.max_lost:
                    del self.tracks[tid]

            else:

                self.tracks[tid].setdefault(
                    "frames",
                    0
                )

        for tid, t in self.tracks.items():

            if t.get("frames", 0) >= 3:

                x1, y1, x2, y2 = map(
                    int,
                    t["box"]
                )

                results.append(
                    (
                        x1,
                        y1,
                        x2,
                        y2,
                        t["conf"],
                        tid
                    )
                )

        return results