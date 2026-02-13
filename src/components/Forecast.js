import React from "react";
import { Card, CardContent, Typography, Grid } from "@mui/material";

function Forecast({ forecast, unit }) {
  return (
    <Grid container spacing={2}>
      {forecast.map((day, index) => (
        <Grid item xs={4} key={index}>
          <Card sx={{ backgroundColor: "transparent", boxShadow: "none" }}>
            <CardContent sx={{ textAlign: "center" }}>
              <Typography variant="subtitle2" sx={{ color: "white" }}>
                {new Date(day.date).toLocaleDateString("en-US", {
                  weekday: "short",
                })}
              </Typography>
              <img
                src={`https:${day.day.condition.icon}`}
                alt="weather"
                style={{ width: "50px", margin: "0 auto" }}
              />
              <Typography variant="body1" sx={{ color: "white" }}>
                {unit === "C"
                  ? `${day.day.avgtemp_c}°C`
                  : `${day.day.avgtemp_f}°F`}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      ))}
    </Grid>
  );
}


export default Forecast;
