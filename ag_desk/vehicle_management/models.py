from django.db import models


class VehicleItem(models.Model):
    id = models.AutoField(primary_key=True)
    vehicle_name = models.CharField(max_length=100)
    vehicle_type = models.CharField(max_length=100, db_index=True)
    vehicle_make = models.CharField(max_length=100)
    vehicle_model = models.CharField(max_length=100)
    vehicle_year = models.IntegerField(db_index=True)
    service_status = models.CharField(max_length=100)
    next_service_date = models.DateField(null=True, blank=True)
    registration_renewal_date = models.DateField(null=True, blank=True)
    image = models.ImageField(upload_to='vehicles/', null=True, blank=True)

    #farm_id = models.ForeignKey(FarmDetails, on_delete=models.CASCADE, related_name='vehicles')

    #class Meta:
        # Define the composite primary key
   #     unique_together = (('id', 'farm'),)

    def __str__(self):
        return self.vehicle_name
