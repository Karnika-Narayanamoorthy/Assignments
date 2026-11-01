import { Injectable } from '@angular/core';

const API = 'http://localhost:5000/api';

@Injectable({
  providedIn: 'root'
})
export class CourseService {

  // Get all courses
  async getCourses(): Promise<any[]> {

    const response = await fetch(`${API}/courses`);

    if (!response.ok) {
      throw new Error('Unable to fetch courses');
    }

    return await response.json();
  }

  // Register student
  async registerStudent(data: any): Promise<any> {

    const response = await fetch(`${API}/registrations`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.message || 'Registration failed');
    }

    return result;
  }

  // Get registrations
  async getRegistrations(): Promise<any[]> {

    const response = await fetch(`${API}/registrations`);

    if (!response.ok) {
      throw new Error('Unable to fetch registrations');
    }

    return await response.json();
  }

  // Cancel registration
  async cancelRegistration(id: string): Promise<any> {

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