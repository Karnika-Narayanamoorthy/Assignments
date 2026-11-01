import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CourseService } from './services/course';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App implements OnInit {

  courses: any[] = [];
  registrations: any[] = [];

  studentName = '';
  rollNo = '';
  email = '';
  courseId = '';

  message = '';
  errorMessage = '';

  loading = false;

  constructor(private courseService: CourseService) {}

  ngOnInit(): void {
    this.loadData();
  }

  // Load courses and registrations
  async loadData(): Promise<void> {
    this.loading = true;

    try {
      this.courses = await this.courseService.getCourses();
      this.registrations =
        await this.courseService.getRegistrations();
    } catch (error: any) {
      this.errorMessage = error.message;
    } finally {
      this.loading = false;
    }
  }

  // Register student
  async registerStudent(): Promise<void> {

    this.message = '';
    this.errorMessage = '';

    if (!this.studentName.trim() ||
        !this.rollNo.trim() ||
        !this.email.trim() ||
        !this.courseId) {

      this.errorMessage = 'Please fill all required fields';
      return;
    }

    try {
      const result = await this.courseService.registerStudent({
        studentName: this.studentName.trim(),
        rollNo: this.rollNo.trim(),
        email: this.email.trim(),
        courseId: this.courseId
      });

      this.message = result.message;

      this.studentName = '';
      this.rollNo = '';
      this.email = '';
      this.courseId = '';

      await this.loadData();

    } catch (error: any) {
      this.errorMessage = error.message;
    }
  }

  // Cancel registration
  async cancelRegistration(id: string): Promise<void> {

    if (!confirm('Are you sure you want to cancel this registration?')) {
      return;
    }

    try {
      const result =
        await this.courseService.cancelRegistration(id);

      this.message = result.message;
      this.errorMessage = '';

      await this.loadData();

    } catch (error: any) {
      this.errorMessage = error.message;
    }
  }
}
