import React from "react";

import { useEffect, useMemo, useState } from "react";
import {
  Box,
  Button,
  Card,
  CardContent,
  Grid,
  Typography,
  Alert,
} from "@mui/material";
import RocketLaunchIcon from "@mui/icons-material/RocketLaunch";

import {
  ingestLaunches,
  fetchLaunches,
  fetchMetrics,
  fetchBrief,
} from "../api";
import MetricCards from "./MetricCards";
import Charts from "./Charts";
import LaunchTable from "./LaunchTable";

export default function Dashboard() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [launches, setLaunches] = useState([]);
  const [metrics, setMetrics] = useState(null);
  const [brief, setBrief] = useState(null);

  const chartData = useMemo(() => {
    return (launches || [])
      .slice(0, 20)
      .map((l) => ({
        name:
          (l?.name?.length ?? 0) > 14
            ? `${l.name.slice(0, 14)}…`
            : l?.name ?? "",
        success: l?.success === true ? 1 : l?.success === false ? 0 : null,
        upcoming: l?.upcoming ? 1 : 0,
      }))
      .reverse();
  }, [launches]);

  const refreshAll = async () => {
    setError("");
    setLoading(true);
    try {
      const [launchRes, metricsRes, briefRes] = await Promise.all([
        fetchLaunches(60),
        fetchMetrics(),
        fetchBrief(),
      ]);

      setLaunches(launchRes?.items || []);
      setMetrics(metricsRes || null);
      setBrief(briefRes || null);
    } catch (err) {
      setError(err?.message || "Failed to load data");
    } finally {
      setLoading(false);
    }
  };

  const handleIngest = async () => {
    setError("");
    setLoading(true);
    try {
      await ingestLaunches(180);
      await refreshAll();
    } catch (err) {
      setError(err?.message || "Ingest failed");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refreshAll();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Box sx={{ pb: 6 }}>
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <Box sx={{ display: "flex", gap: 2, alignItems: "center", mb: 2 }}>
        <Button
          variant="contained"
          startIcon={<RocketLaunchIcon />}
          onClick={handleIngest}
          disabled={loading}
        >
          Ingest Latest SpaceX Launches
        </Button>

        <Button variant="outlined" onClick={refreshAll} disabled={loading}>
          Refresh
        </Button>
      </Box>

      <MetricCards metrics={metrics} />

      <Grid container spacing={2}>
        <Grid item xs={12} md={7}>
          <Charts data={chartData} />
        </Grid>

        <Grid item xs={12} md={5}>
          <Card sx={{ height: "100%" }}>
            <CardContent>
              <Typography variant="h6" sx={{ fontWeight: 700 }}>
                Structured Summary (JSON)
              </Typography>

              <Typography variant="body2" sx={{ opacity: 0.7, mt: 0.5 }}>
                Rule-based metrics computed server-side. Suitable for
                explainable AI summarization.
              </Typography>

              <Box
                component="pre"
                sx={{
                  mt: 2,
                  p: 2,
                  borderRadius: 2,
                  maxHeight: 360,
                  overflow: "auto",
                  bgcolor: "rgba(0,0,0,0.05)",
                }}
              >
                {JSON.stringify(brief || {}, null, 2)}
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12}>
          <LaunchTable launches={launches} />
        </Grid>
      </Grid>
    </Box>
  );
}
