import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Register from './Register';

/**
 * /join route
 * Entry point when a student scans the physical QR Code standee at Balaji Library.
 * Leads directly to the student registration flow without requiring manual URL typing.
 */
export default function Join() {
  return <Register isFromQr={true} />;
}
