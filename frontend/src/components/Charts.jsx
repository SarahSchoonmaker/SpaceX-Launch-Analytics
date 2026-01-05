import React from "react";

import { Card, CardContent, Typography } from "@mui/material";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";

export default function Charts({ data }) {
  return (
    <Card sx={{ height: "100%" }}>
      <CardContent>
        <Typography variant="h6" sx={{ fontWeight: 700 }}>
          Recent Launch Outcomes
        </Typography>

        <Typography variant="body2" sx={{ opacity: 0.7, mt: 0.5 }}>
          success: 1 = success, 0 = failure (null = unknown / upcoming)
        </Typography>

        <div style={{ width: "100%", height: 360, marginTop: 16 }}>
          <ResponsiveContainer>
            <LineChart data={data || []}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis
                dataKey="name"
                interval={0}
                angle={-20}
                textAnchor="end"
                height={70}
              />
              <YAxis domain={[-0.1, 1.1]} ticks={[0, 1]} />
              <Tooltip />
              <Line type="monotone" dataKey="success" dot />
              <Line type="monotone" dataKey="upcoming" dot />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
