from rest_framework import serializers
from .models import Task, Subtask,Note
from employee_management.models import Employee
from farm.models import Farm

class NoteSerializer(serializers.ModelSerializer):
    class Meta:
        model = Note
        fields = '__all__'
class SubtaskSerializer(serializers.ModelSerializer):
    class Meta:
        model = Subtask
        fields = ["id", "description", "completed"]


class TaskSerializer(serializers.ModelSerializer):
    subtasks = SubtaskSerializer(many=True)
    assigned_employee = serializers.PrimaryKeyRelatedField(
        queryset=Employee.objects.all(),
        allow_null=True,  # Since it can be blank
        required=False,  # Not required
    )
    
    farm = serializers.PrimaryKeyRelatedField(
        queryset=Farm.objects.all(),
        write_only=True  # Make farm write-only if you do not wish to send this in response
    )
    assigned_employee_name = serializers.SerializerMethodField()  # Add this line

    class Meta:
        model = Task
        fields = [
            "id",
            "title",
            "status",
            "severity",
            "image",
            "due_date",
            "created_at",
            "updated_at",
            "subtasks",
            "assigned_employee",
            "assigned_employee_name",
            "farm"
        ]

    def get_assigned_employee_name(self, obj):
        return obj.assigned_employee.name if obj.assigned_employee else None

    def create(self, validated_data):
        subtasks_data = validated_data.pop("subtasks", [])
        assigned_employee_data = validated_data.pop("assigned_employee", None)
        task = Task.objects.create(**validated_data)
        if assigned_employee_data:
            task.assigned_employee = assigned_employee_data
            task.save()
        for subtask_data in subtasks_data:
            Subtask.objects.create(task=task, **subtask_data)
        return task

    def update(self, instance, validated_data):
        instance.title = validated_data.get("title", instance.title)
        instance.status = validated_data.get("status", instance.status)
        instance.severity = validated_data.get("severity", instance.severity)
        instance.image = validated_data.get("image", instance.image)
        instance.due_date = validated_data.get("due_date", instance.due_date)
        instance.assigned_employee = validated_data.get(
            "assigned_employee", instance.assigned_employee
        )
        subtasks_data = validated_data.pop("subtasks", [])
        existing_ids = {subtask.id for subtask in instance.subtasks.all()}
        incoming_ids = {subtask["id"] for subtask in subtasks_data if "id" in subtask}

        # Delete subtasks not included in the incoming data
        Subtask.objects.filter(
            task=instance, id__in=(existing_ids - incoming_ids)
        ).delete()

        # Update existing subtasks and add new ones
        for subtask_data in subtasks_data:
            subtask_id = subtask_data.get("id", None)
            if subtask_id and Subtask.objects.filter(id=subtask_id).exists():
                subtask = Subtask.objects.get(id=subtask_id)
                subtask.description = subtask_data.get(
                    "description", subtask.description
                )
                subtask.completed = subtask_data.get("completed", subtask.completed)
                subtask.save()
            else:
                Subtask.objects.create(task=instance, **subtask_data)

        instance.save()
        return instance

