import { Component, Inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { Market } from '../../../core/models/market.model';

@Component({
  selector: 'app-market-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatSelectModule
  ],
  templateUrl: './market-form.component.html',
  styleUrls: ['./market-form.component.scss']
})
export class MarketFormComponent implements OnInit {
  marketForm: FormGroup;
  isEditMode: boolean;
  
  statusOptions = [
    { value: 'ACTIVE', label: 'Active' },
    { value: 'INACTIVE', label: 'Inactive' },
    { value: 'PENDING', label: 'Pending' }
  ];

  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<MarketFormComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { market?: Market }
  ) {
    this.isEditMode = !!data?.market;
    
    this.marketForm = this.fb.group({
      name: [data?.market?.name || '', [Validators.required, Validators.minLength(3)]],
      description: [data?.market?.description || '', [Validators.required, Validators.minLength(10)]],
      status: [data?.market?.status || 'ACTIVE', Validators.required]
    });
  }

  ngOnInit(): void {}

  onSubmit(): void {
    if (this.marketForm.valid) {
      const formValue = this.marketForm.value;
      
      if (this.isEditMode) {
        // Update existing market
        const updatedMarket: Market = {
          ...this.data.market!,
          ...formValue,
          updatedAt: new Date()
        };
        this.dialogRef.close(updatedMarket);
      } else {
        // Create new market
        const newMarket: Partial<Market> = {
          ...formValue,
          id: Math.floor(Math.random() * 10000), // Mock ID
          createdAt: new Date(),
          updatedAt: new Date()
        };
        this.dialogRef.close(newMarket);
      }
    }
  }

  onCancel(): void {
    this.dialogRef.close();
  }
}