import { Injectable } from '@angular/core';

const API = 'http://localhost:5000/api';

@Injectable({
  providedIn: 'root'
})
export class CourseService {

  async getCourses() {
    const response = await fetch(`${API}/courses`);
    if (!response.ok) {
      throw new Error('Failed to load courses');
    }
    return response.json();
  }

  async registerStudent(data: any) {
    const response = await fetch(`${API}/registrations`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });

    const result = await response.json();
    if (!response.ok) {
      throw new Error(result.message || 'Registration failed');
    }
    return result;
  }

  async getRegistrations() {
    const response = await fetch(`${API}/registrations`);
    if (!response.ok) {
      throw new Error('Failed to load registrations');
    }
    return response.json();
  }

  async cancelRegistration(id: string) {
    const response = await fetch(`${API}/registrations/${id}`, {
      method: 'DELETE'
    });

    const result = await response.json();
    if (!response.ok) {
      throw new Error(result.message || 'Cancellation failed');
    }
    return result;
  }
}