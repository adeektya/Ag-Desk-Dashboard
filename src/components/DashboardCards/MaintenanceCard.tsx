import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Card,
  CardContent,
  Typography,
  List,
  ListItem,
  ListItemText,
  Divider,
} from '@mui/material';
import './maintenancecard.css';

const EquipmentMaintenanceCard: React.FC = () => {
  const [upcomingServiceVehicles, setUpcomingServiceVehicles] = useState([]);
  const [maintenanceRequiredVehicles, setMaintenanceRequiredVehicles] = useState([]);

  useEffect(() => {
    fetchVehicles();
  }, []);

  const fetchVehicles = async () => {
    try {
      const response = await axios.get('http://127.0.0.1:8000/vehicle/');
      const data = response.data;

      // Filter vehicles whose next_service_date or registration_renewal_date is within one month from today
      const today = new Date();
      const oneMonthFromNow = new Date(today);
      oneMonthFromNow.setMonth(oneMonthFromNow.getMonth() + 1);

      const upcomingServicesVehicles = data.filter((vehicle) => {
        const nextServiceDate = new Date(vehicle.next_service_date);
        const registrationRenewalDate = new Date(vehicle.registration_renewal_date);
        return (
          nextServiceDate <= oneMonthFromNow || 
          registrationRenewalDate <= oneMonthFromNow
        );
      });

      setUpcomingServiceVehicles(upcomingServicesVehicles);

      // Filter vehicles based on service status (service due or needs repair)
      const maintenanceRequiredVehicles = data.filter(
        (vehicle) =>
          vehicle.service_status === 'Service Due' ||
          vehicle.service_status === 'Needs Repair'
      );
      setMaintenanceRequiredVehicles(maintenanceRequiredVehicles);
    } catch (error) {
      console.error('Failed to fetch vehicles:', error);
    }
  };

  return (
    <Card className="equipment-maintenance-card">
      <CardContent>
        <Typography
          variant="h6"
          component="h2"
          className="equipment-maintenance-header"
        >
          Vehicle Maintenance
        </Typography>
        <Typography
          sx={{ mt: 2 }}
          color="text.secondary"
          className="upcoming-services-header"
        >
          Upcoming Service Dates
        </Typography>
        <List className="service-list">
          {upcomingServiceVehicles.map((vehicle, index) => (
            <ListItem key={index} className="service-list-item">
              <ListItemText
                primary={vehicle.vehicle_name}
                secondary={`Next Service Date: ${vehicle.next_service_date}, Registration Renewal Date: ${vehicle.registration_renewal_date}`}
                primaryTypographyProps={{ className: 'service-item-primary' }}
                secondaryTypographyProps={{ className: 'service-item-secondary' }}
              />
            </ListItem>
          ))}
        </List>
        <Divider />
        <Typography
          sx={{ mt: 2 }}
          color="text.secondary"
          className="maintenance-history-header"
        >
          Maintenance Required
        </Typography>
        <List
          sx={{ maxHeight: 200, overflow: 'auto' }}
          className="history-list"
        >
          {maintenanceRequiredVehicles.map((vehicle, index) => (
            <ListItem key={index} className="history-list-item">
              <ListItemText
                primary={`${vehicle.vehicle_name} -  ${vehicle.service_status}`}
                primaryTypographyProps={{ className: 'history-item-primary' }}
              />
            </ListItem>
          ))}
        </List>
      </CardContent>
    </Card>
  );
};

export default EquipmentMaintenanceCard;
