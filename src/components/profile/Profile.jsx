import React, { useState, useContext } from 'react';
import { useRouter } from 'next/router';
import QRCode from 'qrcode.react';
import EventItem from '../search/results/EventItem';
import styles from '../../styles/Profile.module.css';
import { UserContext } from '../../contexts';

export default function Profile({ performer }) {
  const router = useRouter();
  const user = useContext(UserContext);
  const [qrcodeMode, setQRCodeMode] = useState(false);
  const paypalLink = 'https://paypal.me/';
  const venmoLink = 'https://venmo.com/u/';
  const cashappLink = 'https://cash.app/';
  const onIconClick = (link, username) => router.push(`${link}${username}`);
  const addEventClick = () => router.push('/create');

  if (!qrcodeMode) {
    return (
      <div className={styles.profileContainer}>
        <div className='master-title'>{performer?.name}</div>
        {performer?.photo === null ? <img className={styles.defaultProfileImage} src="/imgs/combined instruments with circle thicker outline.svg" alt="default profile image"/>
          : <img className={styles.profileImage} src={performer?.photo} alt='profile-image'/>}
        <div className={styles.profileBio}>{performer?.bio}</div>
        <div className={styles.tipsContainer}>
          <div className={styles.qrButtonContainer} onClick={() => setQRCodeMode(true)}>
            {/* <div className={styles.qrButtonRight}></div> */}
            <button className={styles.qrButton}>QR</button>
            <img className={styles.qrIcon} src='/imgs/qr-code.png' alt='qr-icon'/>
          </div>

          {/* change these to links that lead to tips URLs */}
          <div>
            <img className ={styles.tipIcon} src='/imgs/tip-paypal-40px.png' alt='paypal' onClick={() => onIconClick(paypalLink, performer.paypal)}/>
            <img className ={styles.tipIcon} src='/imgs/tip-cashapp-40px.png' alt='cashapp' onClick={() => onIconClick(cashappLink, performer.cashapp)}/>
            <img className ={styles.tipIcon} src='/imgs/tip-venmo-40px.png' alt ='venmo' onClick={() => onIconClick(venmoLink, performer.venmo)}/>
          </div>
        </div>
        {(user !== null && performer.id === user.id)
        && <button className='master-button' type='text' onClick={addEventClick}>Add Event</button>}
        <div className='master-title'>Upcoming Events:</div>
        <div className={styles.eventCardsContainer}>
          {performer?.events.map((event, i) => <EventItem key={i} event={event}/>)}
        </div>
      </div>
    );
  }

  return (
    <div className={styles.qrContainer}>
      <div className={styles.qrcode}>
        <QRCode value={`${process.env.NEXT_PUBLIC_DOMAIN}/profile/${performer.id}`} size={220}/>
      </div>
      <button className={styles.backButton} onClick={() => setQRCodeMode(false) }>Back</button>
    </div>
  );
}
