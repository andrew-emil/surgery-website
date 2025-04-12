import { useEffect, useState } from "react";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import { Box, CardHeader, Container, Divider, Skeleton } from "@mui/material";
import axiosClient from "./../axiosClient";
import StarRating from "./../components/StarRating";
import { useNavigate } from "react-router-dom";
import { FormButton } from "../components/StyledComponents";

export default function OpenSlots() {
  const [loading, setLoading] = useState(true);
  const [openSlots, setOpenSlots] = useState([]);
  const [err, setErr] = useState(null);
  const navigate = useNavigate();

  const statusColors = {
    Completed: "green",
    Ongoing: "yellow",
    Cancelled: "red",
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axiosClient.get("/surgery/open-slots", {
          withCredentials: true,
        });
        const { data } = response;

        setOpenSlots(data.surgeries);
      } catch (err) {
        console.log(err);
        setErr(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleButtonClick = (surgeryId) => {
    console.log(surgeryId);
    navigate("/surgeryDetails", {
      state: {
        surgeryId,
      },
    });
  };

  if (loading) {
    return (
      <Container>
        <Skeleton variant="rectangular" height={205} sx={{ marginY: "1rem" }} />
        <Skeleton variant="rectangular" height={205} sx={{ marginY: "1rem" }} />
        <Skeleton variant="rectangular" height={205} sx={{ marginY: "1rem" }} />
      </Container>
    );
  }

  if (err) {
    return (
      <Container
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          display: "flex",
          width: "auto",
        }}
      >
        {err && (
          <Typography
            variant="h4"
            sx={{
              marginBottom: "1rem",
              color: "red",
            }}
          >
            {err}
          </Typography>
        )}
      </Container>
    );
  }
  console.log(openSlots);
  return (
    <Container>
      {openSlots.length > 0 ? (
        openSlots.map((data) => {
          return (
            <Card
              key={data.id}
              sx={{ width: "100%", borderRadius: 3, boxShadow: 3, p: 2 }}
            >
              <CardHeader
                title={data.surgeryName}
                subheader={data.hospital}
                titleTypographyProps={{ variant: "h6", fontWeight: 600 }}
                subheaderTypographyProps={{ color: "text.secondary" }}
              />
              <Divider />
              <CardContent>
                <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                  <Box display="flex" flexDirection="column" gap={1}>
                    <Typography variant="body1">
                      <strong>Available Slot:</strong> {data.availableSlot}
                    </Typography>
                    <Typography variant="body1">
                      <strong>Department:</strong> {data.department}
                    </Typography>
                  </Box>
                  <Box sx={{ alignSelf: "flex-end" }}>
                    <FormButton
                      type="button"
                      variant="contained"
                      className="btn btn-black btn-block"
                    >
                      Request Surgery
                    </FormButton>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          );
        })
      ) : (
        <Typography>No available slots</Typography>
      )}
    </Container>
  );
}
