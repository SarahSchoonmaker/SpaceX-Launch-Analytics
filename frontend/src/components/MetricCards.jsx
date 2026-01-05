import React from "react";

import { Grid, Card, CardContent, Typography } from "@mui/material";

function Metric({ label, value }) {
  return (
    <Card>
      <CardContent>
        <Typography variant="caption" sx={{ opacity: 0.7 }}>
          {label}
        </Typography>
        <Typography variant="h5" sx={{ fontWeight: 800, mt: 0.5 }}>
          {value}
        </Typography>
      </CardContent>
    </Card>
  );
}

export default function MetricCards({ metrics }) {
  const m = metrics || {};

  const successRate =
    m.success_rate != null ? `${Math.round(m.success_rate * 100)}%` : "—";

  const avgDays =
    m.avg_days_between_recent != null
      ? `${m.avg_days_between_recent} days`
      : "—";

  return (
    <Grid container spacing={2} sx={{ mb: 2 }}>
      <Grid item xs={12} sm={6} md={3}>
        <Metric label="Launches in DB" value={m.total ?? "—"} />
      </Grid>
      <Grid item xs={12} sm={6} md={3}>
        <Metric label="Success Rate (completed)" value={successRate} />
      </Grid>
      <Grid item xs={12} sm={6} md={3}>
        <Metric label="Avg Days Between (recent)" value={avgDays} />
      </Grid>
      <Grid item xs={12} sm={6} md={3}>
        <Metric label="Launch Frequency" value={m.cadence ?? "—"} />
      </Grid>
    </Grid>
  );
}
