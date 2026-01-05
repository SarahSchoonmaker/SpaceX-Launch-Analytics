import React, { useEffect, useMemo, useState } from "react";
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
    // simple chart: last 20 launches with success mapped to 1/0/nullable
    const items = launches.slice(0, 20).map((x) => ({
      name: x.name.length > 14 ? x.name.slice(0, 14) + "…" : x.name,
      success: x.success === true ? 1 : x.success === false ? 0 : null,
      upcoming: x.upcoming ? 1 : 0,
    }));
    return items.reverse();
  }, [launches]);

  async function refreshAll() {
    setError("");
    setLoading(true);
    try {
      const [l, m, b] = await Promise.all([
        fetchLaunches(60),
        fetchMetrics(),
        fetchBrief(),
      ]);
      setLaunches(l.items || []);
      setMetrics(m);
      setBrief(b);
    } catch (e) {
      setError(e.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  async function handleIngest() {
    setError("");
    setLoading(true);
    try {
      await ingestLaunches(180);
      await refreshAll();
    } catch (e) {
      setError(e.message || "Failed to ingest");
    } finally {
      setLoading(false);
    }
  }

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

      <Grid container spacing={2} sx={{ mt: 0 }}>
        <Grid item xs={12} md={7}>
          <Charts data={chartData} />
        </Grid>
        <Grid item xs={12} md={5}>
          <Card sx={{ height: "100%" }}>
            <CardContent>
              <Typography variant="h6" sx={{ fontWeight: 700 }}>
                Auditable Brief (JSON)
              </Typography>
              <Typography variant="body2" sx={{ opacity: 0.7, mt: 0.5 }}>
                Deterministic facts computed server-side. Safe for structured
                LLM summarization.
              </Typography>

              <Box
                component="pre"
                sx={{
                  mt: 2,
                  p: 2,
                  borderRadius: 2,
                  overflow: "auto",
                  maxHeight: 360,
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
