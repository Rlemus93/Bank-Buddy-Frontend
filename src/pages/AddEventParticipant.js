import React from "react"
import { useForm } from "react-hook-form"
import { Col, Form, FormGroup, Label, Row } from "reactstrap"
import { Link, useParams } from "react-router-dom"

const AddEventParticipant = ({ eventId, createEventParticipant }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm()

  const onSubmit = (newEventParticipant) => {
    createEventParticipant(newEventParticipant)
  }
  return (
    <Form onSubmit={handleSubmit(onSubmit)} className="form-size">
      <h3 className="title-header center-content">Add Event Participant</h3>
      <Row>
        <Col md={6}>
          <FormGroup>
            <Label for="user_id">User's Email</Label>
            <input
              style={{
                width: "30vw",
              }}
              id="user_id"
              name="user_id"
              type="text"
              className="form-control"
              {...register("user_id", { required: true })}
            />
            {errors.user_id && (
              <span className="form-validations">User_id Required</span>
            )}
          </FormGroup>
        </Col>
        <Col md={6}>
          <FormGroup>
            <Label for="event_id">Event ID</Label>
            <input
              style={{
                width: "30vw",
              }}
              id="event_id"
              name="event_id"
              type="text"
              className="form-control"
              value={eventId}
              readOnly
              {...register("event_id", { required: true })}
            />
            {errors.event_id && (
              <span className="form-validations">Event ID is required</span>
            )}
          </FormGroup>
        </Col>
      </Row>
      <Row>
        <Col md={6}>
          <FormGroup>
            <Label for="individual_contributions">
              Individual Contributions
            </Label>
            <input
              style={{
                width: "30vw",
              }}
              value="0"
              readOnly
              id="individual_contributions"
              name="individual_contributions"
              type="text"
              className="form-control"
              {...register("individual_contributions", { required: true })}
            />
            {errors.individual_contributions && (
              <span className="form-validations">
                Individual Contribution is Required
              </span>
            )}
          </FormGroup>
        </Col>
      </Row>
      <div className="center-content">
        <Link to="/dashboard">
          <button className="new-edit-button">Back</button>
        </Link>
        <button className="new-edit-button" type="submit">
          Submit
        </button>
      </div>
    </Form>
  )
}

export default AddEventParticipant