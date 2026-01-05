import React from "react";

import {
  Card,
  CardContent,
  Typography,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Chip,
  Box,
} from "@mui/material";

function fmt(iso) {
  try {
    return new Date(iso).toLocaleString();
  } catch {
    return iso ?? "";
  }
}

function statusChip(l) {
  if (l.upcoming) return <Chip label="UPCOMING" size="small" />;
  if (l.success === true) return <Chip label="SUCCESS" size="small" />;
  if (l.success === false) return <Chip label="FAIL" size="small" />;
  return <Chip label="UNKNOWN" size="small" />;
}

export default function LaunchTable({ launches }) {
  const items = Array.isArray(launches) ? launches : [];

  return (
    <Card>
      <CardContent>
        <Typography variant="h6" sx={{ fontWeight: 700 }}>
          Launches
        </Typography>

        {items.length === 0 ? (
          <Box sx={{ mt: 2, opacity: 0.7 }}>
            <Typography variant="body2">
              No launches loaded yet. Click{" "}
              <b>“Ingest Latest SpaceX Launches”</b>.
            </Typography>
          </Box>
        ) : (
          <Table size="small" sx={{ mt: 1 }}>
            <TableHead>
              <TableRow>
                <TableCell>Date</TableCell>
                <TableCell>Name</TableCell>
                <TableCell>Status</TableCell>
                <TableCell align="right">Flight #</TableCell>
                <TableCell align="right">Payloads</TableCell>
                <TableCell align="right">Reused Cores</TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {items.map((l, idx) => (
                <TableRow key={l.id ?? `${l.name}-${idx}`}>
                  <TableCell>{fmt(l.date_utc)}</TableCell>
                  <TableCell>{l.name}</TableCell>
                  <TableCell>{statusChip(l)}</TableCell>
                  <TableCell align="right">{l.flight_number ?? "—"}</TableCell>
                  <TableCell align="right">{l.payloads_count ?? "—"}</TableCell>
                  <TableCell align="right">{l.cores_reused ?? "—"}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
}
