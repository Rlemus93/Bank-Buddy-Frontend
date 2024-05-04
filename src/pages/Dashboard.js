import React, { useState, useEffect } from "react"
import {
  Progress,
  Card,
  CardTitle,
  Button,
  Offcanvas,
  OffcanvasHeader,
  OffcanvasBody,
} from "reactstrap"
import DashModal from "../components/DashModal"
import { Link } from "react-router-dom"
import { FaPlus } from "react-icons/fa"
import { Tooltip } from "react-tooltip"

const Dashboard = ({ currentUser, deleteEvent, setEventId }) => {
  const [showOffcanvas, setShowOffcanvas] = useState(false)
  const [userEvents, setUserEvents] = useState(null)
  const [eventsWithColor, setEventsWithColor] = useState(null)
  const [newHovered, setNewHovered] = useState(false)

  useEffect(() => {
    getPermittedEvents()
  }, [])

  useEffect(() => {
    sortEvents()
  }, [userEvents])

  const handleToggle = () => {
    setShowOffcanvas(!showOffcanvas)
  }

  const getPermittedEvents = async () => {
    try {
      const getResponse = await fetch(
        `http://localhost:3000/event_participants/${currentUser.id}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: localStorage.getItem("token"),
          },
        }
      )
      if (!getResponse.ok) {
        throw new Error("Error on the get request for events")
      }
      const getResult = await getResponse.json()
      setUserEvents(getResult)
    } catch (error) {
      console.log("Ooops something went wrong", error.message)
    }
  }

  const barColors = [
    "#8C53FF",
    "#6f71ee",
    "#5390dd",
    "#38afd9",
    "#2abfd6",
    "#1cded0",
    "#0eeed9",
  ]

  const sortEvents = () => {
    let myEvents = userEvents?.filter(
      (event) => event.creator === currentUser.id
    )
    let invitedEvents = userEvents?.filter(
      (event) => event.creator !== currentUser.id
    )
    let allEvents = myEvents?.concat(invitedEvents)
    assignColors(allEvents)
  }

  const assignColors = (sortedEvents) => {
    const assigningColor = sortedEvents?.map((event, index) => ({
      ...event,
      color: barColors[index % barColors.length],
    }))
    setEventsWithColor(assigningColor)
  }

  const isItMine = (events) => {
    return events?.filter((event) => event.creator === currentUser.id)
  }

  const wasIInvited = (events) => {
    return events?.filter((event) => event.creator !== currentUser.id)
  }

  const convertUSD = (amount) => {
    const [dollars, cents] = String(amount).split(".")
    const formattedDollars = dollars.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
    const formattedAmount = `${formattedDollars}.${cents || "00"}`
    return `$${formattedAmount}`
  }

  console.log(currentUser)

  return (
    <>
      <div>
        <div className="d-flex pic-div">
          <img
            data-tooltip-id="my-tooltip"
            data-tooltip-content={`${currentUser.firstname}'s Profile`}
            src={currentUser.profile_photo_url}
            alt="your profile picture"
            style={{
              height: "8vh",
              cursor: "pointer",
            }}
            onClick={handleToggle}
          />
        </div>
        <Tooltip
          id="my-tooltip"
          style={{
            backgroundColor: "#E9ECEF",
            color: "#888787",
            fontWeight: 600,
          }}
        />
        <Offcanvas isOpen={showOffcanvas} toggle={handleToggle}>
          <div className="slide-close-btn-cont">
            <Button className="slide-close-btn" onClick={handleToggle}>
              X
            </Button>
          </div>
          <OffcanvasHeader>
            {currentUser.firstname} {currentUser.lastname}
          </OffcanvasHeader>
          <OffcanvasBody>
            <p>{`Username: ${currentUser.username}`}</p>
            <p>{`Email: ${currentUser.email}`}</p>
            <Link to="/new">
              <Button className="btn-class">Add Event</Button>
            </Link>
          </OffcanvasBody>
        </Offcanvas>
      </div>
      <div className="main-dash-cont">
        <div className="middle-dash-cont">
          <div style={{ textAlign: "center" }}>
            <h1 className="mb-5">{`${currentUser.firstname}'s Dashboard`}</h1>
          </div>
          <div
            className="d-flex mb-3"
            style={{ justifyContent: "center", flexDirection: "column" }}
          >
            <h3>Overall Stats</h3>
            <div className="progress-bars">
              {eventsWithColor &&
                eventsWithColor.map((event) => (
                  <div key={event.id}>
                    <p
                      style={{
                        fontWeight: 600,
                        color: "#38373799",
                        marginBottom: "1vh",
                      }}
                    >
                      {event && event.title}
                    </p>
                    <Progress
                      animated
                      className="my-2"
                      value={(event.grouptotal / event.eventamount) * 100}
                    >
                      <p
                        style={{
                          marginTop: "1.75vh",
                          backgroundColor: event.color,
                        }}
                      >
                        {convertUSD(event.grouptotal)}
                      </p>
                    </Progress>
                  </div>
                ))}
            </div>
          </div>
          <div className="personal-cont">
            <h3>{`Created Events`}</h3>
            <div className="d-flex gap-3 wrap-cards mb-3">
              {eventsWithColor &&
                isItMine(eventsWithColor).map((event) => (
                  <Card key={event.id} body className="card-body">
                    <CardTitle
                      style={{
                        fontSize: "3vh",
                        height: "50%",
                        fontWeight: "500",
                        color: "#38373799",
                      }}
                    >
                      <p>{event && event.title}</p>
                    </CardTitle>
                    <div
                      style={{
                        height: "50%",
                        color: "#38373799",
                        fontWeight: 600,
                      }}
                    >
                      <div className="text-center">{`Goal: ${convertUSD(
                        event.eventamount
                      )}`}</div>
                      <Progress
                        animated
                        className="my-2"
                        value={(event.grouptotal / event.eventamount) * 100}
                      >
                        <p
                          style={{
                            marginTop: "1.75vh",
                            backgroundColor: event.color,
                          }}
                        >
                          {convertUSD(event.grouptotal)}
                        </p>
                      </Progress>
                      <DashModal
                        event={event}
                        currentUser={currentUser}
                        overallBarVisual={
                          (event.grouptotal / event.eventamount) * 100
                        }
                        deleteEvent={deleteEvent}
                        getPermittedEvents={getPermittedEvents}
                        setEventId={setEventId}
                      />
                    </div>
                  </Card>
                ))}
              <Link to="/new" style={{ textDecoration: "none" }}>
                <Card
                  body
                  className="card-body add-event-card d-flex"
                  style={{ justifyContent: "center", alignItems: "center" }}
                  onMouseEnter={() => setNewHovered(true)}
                  onMouseLeave={() => setNewHovered(false)}
                >
                  <span
                    style={{
                      fontSize: "3vh",
                      fontWeight: "500",
                      color: "#38373799",
                    }}
                  >
                    {!newHovered ? (
                      "Create an Event"
                    ) : (
                      <FaPlus style={{ height: "5vh", color: "#fff" }} />
                    )}
                  </span>
                </Card>
              </Link>
            </div>
            <h3>Invited Events</h3>
            <div className="d-flex gap-3 wrap-cards">
              {eventsWithColor &&
                wasIInvited(eventsWithColor).map((event) => (
                  <Card key={event.id} body className="card-body">
                    <CardTitle
                      style={{
                        fontSize: "3vh",
                        height: "50%",
                        fontWeight: "500",
                        color: "#38373799",
                      }}
                    >
                      <p>{event && event.title}</p>
                    </CardTitle>
                    <div
                      style={{
                        height: "50%",
                        color: "#38373799",
                        fontWeight: 600,
                      }}
                    >
                      <div className="text-center">{`Goal: ${convertUSD(
                        event.eventamount
                      )}`}</div>
                      <Progress
                        animated
                        className="my-2"
                        value={(event.grouptotal / event.eventamount) * 100}
                      >
                        <p
                          style={{
                            marginTop: "1.75vh",
                            backgroundColor: event.color,
                          }}
                        >
                          {convertUSD(event.grouptotal)}
                        </p>
                      </Progress>
                      <DashModal
                        event={event}
                        currentUser={currentUser}
                        overallBarVisual={
                          (event.grouptotal / event.eventamount) * 100
                        }
                        deleteEvent={deleteEvent}
                        getPermittedEvents={getPermittedEvents}
                        setEventId={setEventId}
                      />
                    </div>
                  </Card>
                ))}
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default Dashboard
