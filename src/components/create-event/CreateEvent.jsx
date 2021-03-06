import React, { useContext, useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import DatePicker from 'react-datepicker';
import ImageUploader from './ImageUploader';
import styles from '../../styles/CreateEvent.module.css';
import Map from '../map/Map';
import { LocationContext } from '../../contexts';
import { createEvent, findConflicts } from '../../interface';

const CreateEvent1 = ({
  center,
  handleDate,
  handleLocation,
  handleNext,
  handleEndDate,
  nextClickAttempted,
  date,
  endDateAndTime,
  loc,
  setEventLoc,
}) => {
  const mapContainerStyle = {
    height: '300px',
    width: '100%',
  };

  const [startDate, setStartDate] = useState();
  const [endDate, setEndDate] = useState();

  const onDateChange = (date) => {
    if (date !== null) {
      setStartDate(date);
      setEndDate(Math.max(date, endDate));
      handleDate(date);
    }
  };

  const onEndDateChange = (date) => {
    if (date !== null) {
      setEndDate(date);
      handleEndDate(date);
    }
  };

  // const displayLocation = () => {
  //   console.log('loc', loc);
  //   let lat = loc.lat;
  //   let lng = loc.lng;
  //   return `lat: ${lat}, lng: ${lng}`
  // }

  const warningStyle = (condition) => nextClickAttempted && condition
    ? styles.validationWarning
    : styles.validationWarningHidden;

  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const startTime = startDate || now;
  const startDay = new Date(startTime.getFullYear(), startTime.getMonth(), startTime.getDate());

  return (
    <div className={styles.createEventContainer}>
      <div className="master-title">
        Create Event
      </div>
      <form className={styles.formContainer}>
        <div className={warningStyle(!date)}>
          Please select a start date and time
        </div>
        <DatePicker
          className={styles.datePicker}
          selected={startDate}
          onChange={onDateChange}
          placeholderText="Select Start Date and Time"
          showTimeSelect
          dateFormat="MMMM d, yyyy h:mm aa"
          startDate={now}
          filterDate={date => date >= today}
          filterTime={time => time >= now}
        />
        <div className={warningStyle(!endDateAndTime)}>
          Please select an end date and time
        </div>
        <DatePicker
          className={styles.datePicker}
          selected={endDate}
          onChange={onEndDateChange}
          placeholderText="Select End Date and Time"
          showTimeSelect dateFormat="MMMM d, yyyy h:mm aa"
          startDate={startTime}
          filterDate={date => date >= startDay}
          filterTime={time => time >= startTime}
        />
        <div className={warningStyle(!loc)}>
          Please select a location
        </div>
        <input
          onChange={handleLocation}
          type="text"
          placeholder="Current Location"
          className={styles.masterSearchBar}
          value={loc ? `Lat: ${loc.lat.toFixed(4)}, Lng: ${loc.lng.toFixed(4)}` : ''}
        />
      </form>
      <div className={styles.mapContainer}>
        <Map
          center={center}
          onDrop={setEventLoc}
          containerStyle={mapContainerStyle}
          withInfoBoxes={false}
        />
      </div>
      <button onClick={handleNext} className="master-button">
        Next
      </button>
    </div>
  );
};

const CreateEvent2 = ({ handleModifyConflict }) => (
  <div className={styles.conflictBoxContainer}>
    <div className="master-title">
      Create Event
    </div>
    <div className={styles.conflictBox}>
      <div>
        Someone is performing at the same location.
        Do you still wish to have your event on this day and time?
      </div>
      <div className={styles.conflictButtonContainer}>
        <button
          className={styles.conflictButtonModify}
          onClick={() => handleModifyConflict(1)}>
            Modify
        </button>
        <button
          className={styles.conflictButtonProceed}
          onClick={() => handleModifyConflict(3)}
        >
          Proceed
        </button>
      </div>
    </div>
  </div>
);

const CreateEvent3 = ({
  handleName,
  handleDescription,
  handleTags,
  handleImage,
  handleGoBack,
  handleAddMyEvent,
  handleUploadMode,
  uploadMode,
  image,
  submitAttempted,
  name,
  description,
  tags,
}) => {
  const [uploadView, setUploadView] = useState(false);
  useEffect(() => {
    setUploadView(uploadMode);
  }, [uploadMode]);

  const warningStyle = (condition) => submitAttempted && condition
    ? styles.validationWarning
    : styles.validationWarningHidden;

  if (!uploadView) {
    return (
      <div className={styles.createEventContainer}>
        <div>
          <div className="master-title">
            Create Event
          </div>
          <form className={styles.formContainer}>
            <label htmlFor="eventName" className={styles.smallTitle}>
              Event Name:
            </label>
            <div className={warningStyle(!name)}>
              Please enter an event name
            </div>
            <input
              type="text"
              id="eventName"
              onChange={handleName}
              className={styles.masterSearchBar}
              placeholder="Enter Event Name"
              value={name}
            />
            <label htmlFor="eventDescription" className={styles.smallTitle}>
              Description:
            </label>
            <div className={warningStyle(!description)}>
              Please enter a description
            </div>
            <textarea
              type="text"
              id="eventDescription"
              onChange={handleDescription}
              className={styles.descriptionField}
              placeholder="Enter Description" value={description}
            />
            <div className={styles.tagsDescription}>
              <label htmlFor="eventTags" className={styles.smallTitle}>
                Tags
              </label>
              <div className={styles.tagSubtext}>
                (OPTIONAL - Separated By Comma)
              </div>
            </div>
            <input
              type="text"
              id="eventTags"
              onChange={handleTags}
              className={styles.masterSearchBar}
              placeholder='Add Tags (separated by comma)'
              value={tags}
            />
          </form>
          {/* if image exists, render image, otherwise render button */}
          {image ? (
            <img className={styles.uploadedImage} src={image} alt="" />
          ) : (
            <button
              type="text"
              onClick={handleUploadMode}
              className={styles.uploadImageButton}
            >
              Upload Image
            </button>
          )}
        </div>
        <button onClick={handleAddMyEvent} type="text" className="master-button">
          Add My Event
        </button>
      </div>
    );
  }
  return <ImageUploader handleImage={handleImage} handleGoBack={handleGoBack}/>;
};

export default function CreateEvent() {
  const baseCenter = useContext(LocationContext);
  const router = useRouter();
  const [createPage, setCreatePage] = useState(1);
  const [name, setEventName] = useState('');
  const [description, setEventDescription] = useState('');
  const [image, setEventImage] = useState();
  const [date, setEventDate] = useState();
  const [endDateAndTime, setEventEndDate] = useState();
  const [loc, setLoc] = useState();
  const [tags, setEventTags] = useState('');
  const [uploadMode, setUploadMode] = useState(false);
  const [submitAttempted, setSubmitAttempted] = useState(false);
  const [nextClickAttempted, setNextClickAttempted] = useState(false);
  const center = loc || baseCenter;

  const handleDate = (date) => {
    setEventDate(date);
  };

  const handleEndDate = (date) => {
    setEventEndDate(date);
  };

  const handleLocation = (e) => {
    e.preventDefault();
    setLoc(e.target.value);
  };

  const handleName = (e) => {
    e.preventDefault();
    setEventName(e.target.value);
  };

  const handleDescription = (e) => {
    e.preventDefault();
    setEventDescription(e.target.value);
  };

  const handleTags = (e) => {
    e.preventDefault();
    setEventTags(e.target.value);
  };

  const handleNext = () => {
    if (!loc || !date || !endDateAndTime || endDateAndTime < date) {
      setNextClickAttempted(true);
      return;
    }
    findConflicts({
      center,
      from: date,
      to: endDateAndTime,
    }).then(conflict => {
      if (conflict.length !== 0) {
        setCreatePage(2);
      } else {
        setCreatePage(3);
      }
    }).catch(console.error);
  };

  const handleAddMyEvent = () => {
    if (name && description && image && date && endDateAndTime && loc) {
      const data = {
        name,
        description,
        center: loc,
        tags: tags.split(','),
        starts: date,
        ends: endDateAndTime,
        photos: [image],
      };
      createEvent(data).then(id => router.push(`/event/${id}`))
        .catch(console.error);
    }
    setSubmitAttempted(true);
  };

  const handleImage = (img) => {
    setEventImage(img);
    setUploadMode(false);
  };

  const handleGoBack = () => {
    setUploadMode(false);
  };

  const handleUploadMode = () => {
    setUploadMode(true);
  };

  if (createPage === 1) {
    return (
      <CreateEvent1
        center={center}
        handleDate={handleDate}
        handleEndDate={handleEndDate}
        handleLocation={handleLocation}
        handleNext={handleNext}
        nextClickAttempted={nextClickAttempted}
        loc={loc}
        date={date}
        endDateAndTime={endDateAndTime}
        setEventLoc={setLoc}
      />
    );
  }
  if (createPage === 2) {
    return (
      <CreateEvent2 handleModifyConflict={setCreatePage}/>
    );
  }
  if (createPage === 3) {
    return (
      <CreateEvent3
        handleName={handleName}
        handleDescription={handleDescription}
        handleTags={handleTags}
        handleImage={handleImage}
        handleGoBack={handleGoBack}
        handleAddMyEvent={handleAddMyEvent}
        handleUploadMode={handleUploadMode}
        uploadMode={uploadMode}
        image={image}
        submitAttempted={submitAttempted}
        name={name}
        description={description}
        tags={tags}
      />
    );
  }
}
