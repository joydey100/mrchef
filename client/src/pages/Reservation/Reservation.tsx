import { useState, FormEvent } from "react";
import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import "./Reservation.css";
import dayjs, { Dayjs } from "dayjs";
import { DemoContainer, DemoItem } from "@mui/x-date-pickers/internals/demo";
import InputLabel from "@mui/material/InputLabel";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { MobileTimePicker } from "@mui/x-date-pickers/MobileTimePicker";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import InputAdornment from "@mui/material/InputAdornment";
import MessageIcon from "@mui/icons-material/Message";
import ReservationImg from "../../assets/images/reservation.jpeg";
import firebaseStorage from "../../firebase/firebaseStorage";
import "./Reservation.css";
import { useSelector } from "react-redux";
import { RootState } from "../../redux/store/store";

const Reservation = () => {
  const [value, setValue] = useState<Dayjs | null>(dayjs());
  const [person, setPerson] = useState("1");

  // get user from store
  const { user } = useSelector((state: RootState) => state.user);

  //get Reserve Table Functionality from firebaseStorage
  const { reserveTable } = firebaseStorage();

  console.log(user);

  // disable past dates
  const disablePastDates = (date: Dayjs) => {
    return date.isBefore(dayjs(), "day");
  };

  // person select on handle change
  const handlePersonChange = (event: SelectChangeEvent) => {
    setPerson(event.target.value as string);
  };

  // handle reservation
  const handleReservation = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    // get Data
    const reserveData = {
      date: `${value?.date()}/${value!.month() + 1}/${value?.year()}`,
      time: `${value?.format("hh:mm A")}`,
      name: user.displayName,
      email: user.email,
    };

    reserveTable(reserveData);
  };

  return (
    <section className="reservation-section">
      <Container>
        <Grid container spacing={3}>
          <Grid item md={6}>
            <div className="reservation-left">
              <img src={ReservationImg} alt="reservation-img" />
            </div>
          </Grid>
          <Grid item md={6}>
            <div className="reservation-right">
              <Typography variant="h2">Reservation</Typography>
              <Typography variant="body1">
                Experience our delicious food by logging in now!
              </Typography>
              <form className="reservation-form" onSubmit={handleReservation}>
                {/* reservation period */}
                <div className="reservation-period">
                  {/* reservation date */}
                  <div className="reservation-date">
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                      <DemoContainer components={["DatePicker", "DatePicker"]}>
                        <DemoItem label="Reservation Date">
                          <DatePicker
                            value={value}
                            onChange={(newValue) => setValue(newValue)}
                            shouldDisableDate={disablePastDates}
                            format="DD/MM/YYYY"
                          />
                        </DemoItem>
                      </DemoContainer>
                    </LocalizationProvider>
                  </div>

                  {/* reservation time */}
                  <div className="reservation-time">
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                      <DemoContainer
                        components={["TimePicker", "MobileTimePicker"]}
                      >
                        <DemoItem label="Reservation Time">
                          <MobileTimePicker
                            value={value}
                            onChange={(newValue) => setValue(newValue)}
                          />
                        </DemoItem>
                      </DemoContainer>
                    </LocalizationProvider>
                  </div>

                  {/* People Reservation  */}
                  <div className="person-reservation">
                    <FormControl fullWidth>
                      <label htmlFor="person-reserve">Person</label>
                      <Select
                        id="person-reserve"
                        value={person}
                        onChange={handlePersonChange}
                        displayEmpty
                      >
                        <MenuItem value="1"> One Person </MenuItem>
                        <MenuItem value="2"> Two Person </MenuItem>
                        <MenuItem value="3"> Three Person </MenuItem>
                        <MenuItem value="4"> Four Person </MenuItem>
                        <MenuItem value="5"> Five Person </MenuItem>
                        <MenuItem value="6"> Six Person </MenuItem>
                      </Select>
                    </FormControl>
                  </div>

                  {/* Comments */}
                  <div className="Comments">
                    <TextField
                      label="Comments"
                      placeholder="Comments"
                      variant="standard"
                      type="text"
                      name="comments"
                      fullWidth
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <MessageIcon />
                          </InputAdornment>
                        ),
                      }}
                    />
                  </div>
                </div>
                {/* Submit Form Button */}
                <Button
                  variant="contained"
                  type="submit"
                  className="main-btn"
                  fullWidth
                >
                  Book a table
                </Button>
              </form>
            </div>
          </Grid>
        </Grid>
      </Container>
    </section>
  );
};

export default Reservation;
