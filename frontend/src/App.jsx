import React from "react";
import { Container, Box, Typography } from "@mui/material";
import Dashboard from "./components/Dashboard";

export default function App() {
  return (
    <Container maxWidth="lg">
      <Box sx={{ py: 4 }}>
        <Typography variant="h4" sx={{ fontWeight: 700 }}>
          MissionControl AI — SpaceX Launch Dashboard
        </Typography>
        <Typography sx={{ mt: 1, opacity: 0.8 }}>
          Deterministic metrics + auditable JSON brief (no AI-generated
          signals).
        </Typography>
      </Box>
      <Dashboard />
      <Box sx={{ py: 4, opacity: 0.7 }}>
        <Typography variant="caption">
          Educational use only. Not investment advice.
        </Typography>
      </Box>
    </Container>
  );
}
