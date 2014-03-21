"""
    Handles all models related to users :
        - Dept : The department at the fest
        - SubDept : The sub-department at the fest
        - User Profile : Handles the basic information of people, their college, their fest related information
        - ERPUser : Handles the information of a users organizational role

"""
# Django
from django.db import models
from django.contrib.auth.models import User
from django.conf import settings
from django.utils import timezone
# Apps
# Decorators
# Models
from misc.models import College
from apps.walls.models import Wall, Post
from apps.events.models import Event
# Forms
# View functions
# Misc
from misc.utils import *
from misc.constants import *
# Python
import datetime


# Department Models
class Dept(models.Model):
    """ 
        A model having data about specific Departments @ the fest 
    """
    # Relations with other models
    wall            = models.OneToOneField(Wall, related_name='dept')
    
    # Basic information
    name            = models.CharField(max_length=30)
    description     = models.TextField(max_length=500, null=True, blank=True)
    
    def __unicode__(self):
        return self.name

class Subdept(models.Model):
    """ 
        A model having data about specific SubDepartments @ the fest 
        Every subdept is linked to an event 
    """
    # Relations with other models
    dept            = models.ForeignKey(Dept, related_name='subdepts')
    wall            = models.OneToOneField(Wall, related_name='subdept')
    # event           = models.ForeignKey(Event, null=True, blank=True)
    
    # Basic information
    name            = models.CharField(max_length=30)
    description     = models.TextField(max_length=500, null=True, blank=True)
    def __unicode__(self):
        return self.name

class UserProfile(models.Model): # The corresponding auth user
    """
        The model is a basic model for any user who will come into Shaastra.
        
        It handles the basic 
    
    """
    user               = models.OneToOneField(User, related_name='profile') # uses name and email from here. username = email
    
    # Basic information
    gender             = models.CharField(max_length=1, choices=GENDER_CHOICES, default='F')
    age                = models.IntegerField(default=18)
    #dob                = models.DateField(null=True, blank=True)
    mobile_number      = models.CharField(max_length=15, blank=True, null=True, help_text='Please enter your current mobile number')
    avatar             = models.ImageField("Profile Pic", upload_to="avatars/users", blank=True, null=True)
    
    # College info
    branch             = models.CharField(max_length=50, choices=BRANCH_CHOICES, help_text='Your branch of study')
    college            = models.ForeignKey(College, null=True, blank=True)
    college_roll       = models.CharField(max_length=40, null=True)
    school_student     = models.BooleanField(default=False)
    
    # Fest related info
    want_accomodation  = models.BooleanField(default=False, help_text = "Doesn't assure accommodation.")
    
    # Internal flags and keys
    activation_key     = models.CharField(max_length=40, null=True)
    key_expires        = models.DateTimeField(default=timezone.now() + datetime.timedelta(2))
    
    # Fest organizational info
    is_core            = models.BooleanField(default=False)
    is_hospi           = models.BooleanField(default=False)
    
    # Analytics information
    date_created       = models.DateTimeField(auto_now_add=True)

    @property
    def fest_id(self):
        return settings.FEST_NAME[:2].upper + str(self.user.id).zfill(6)
        
    def save(self, *args, **kwargs):
        #self.user.save()
        super(UserProfile, self).save(*args, **kwargs)
    
    def delete(self, *args, **kwargs):
        self.user.delete()
        super(UserProfile, self).delete(*args, **kwargs)
    
    def __unicode__(self):
        return self.user.first_name
    
    class Admin:
        pass

class ERPUser(models.Model):
    # Relations to other models
    user            = models.OneToOneField(User, related_name='erp_profile') # uses name and email from here. username = email
    wall            = models.OneToOneField(Wall, related_name='person')
    
    # Temporary role in the Fest after selecting which identity he is
    # dept            = models.ForeignKey(Dept, related_name='dept_user_set')
    # subdept         = models.ForeignKey(Subdept, blank=True, null=True, default=None, related_name='subdept_user_set')
    # level           = models.IntegerField(default=0) # 0 = Coord, 1 = Supercoord, 2 = Core
    
    # Shaastra Relations - all possible roles in the fest
    coord_relations = models.ManyToManyField(Subdept, null=True, blank=True, related_name='coord_set')
    supercoord_relations = models.ManyToManyField(Dept, null=True, blank=True, related_name='supercoord_set')
    core_relations  = models.ManyToManyField(Dept, null=True, blank=True, related_name='core_set')
    
    # Other random information for profile
    nickname        = models.CharField(max_length=100, blank=True, null=True)
    room_no         = models.IntegerField(default=0, blank=True, null=True )
    hostel          = models.CharField(max_length=15, choices = HOSTEL_CHOICES, blank=True, null=True)
    dob             = models.DateField(null=True, blank=True)
    # mobile_number  = models.CharField(max_length=10, blank=True, null=True)
    summer_number   = models.CharField(max_length=10, blank=True, null=True)
    
    # Holiday stay
    summer_stay     = models.CharField(max_length=30, blank=True, null=True)
    winter_stay     = models.CharField(max_length=30, blank=True, null=True)
    
    
    def __unicode__(self):
        return self.user.first_name + ' ' + self.user.last_name
    
    # Methods to check for position/role
    #def is_coord(self):
    #    return self.level == 0
    #def is_supercoord(self):
    #    return self.level == 1
    #def is_core(self):
    #    return self.level == 2
    #def get_position (self):
    #    """ Gives verbose name for level """
    #    if self.level == 2:
    #        return 'Core'
    #    if self.level == 1:
    #        return 'Supercoord'
    #    if self.level == 0:
    #        return 'Coord'
    #def get_dept_subdept(self):
    #    """ returns : Dept (subdept)"""
    #    dept_str = self.dept.name
    #    if self.subdept:
    #        dept_str += " (" + self.subdept.name + ")"
    #    return dept_str
    