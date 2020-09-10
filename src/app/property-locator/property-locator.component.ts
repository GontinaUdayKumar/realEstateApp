import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { FormControl } from '@angular/forms';
import { MatAutocomplete, MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { MatChipInputEvent } from '@angular/material/chips';
import { PropertyService } from '../service/property.service';
import { MatTableDataSource } from '@angular/material/table';
import { Sort } from '@angular/material/sort';

@Component({
  selector: 'app-property-locator',
  templateUrl: './property-locator.component.html',
  styleUrls: ['./property-locator.component.scss']
})
export class PropertyLocatorComponent implements OnInit {

  selectedConfigs = []
  configurations = [];

  selectable = true;
  removable = true;
  addOnBlur = true;
  separatorKeysCodes: number[] = [ENTER, COMMA];

  propertyCtrl = new FormControl();
  minPriceCtrl = new FormControl();
  configCtrl = new FormControl();

  filteredConfigs: Observable<string[]>;
  uniqueConfigurations = new Set();
  filteredConfigurations = [];
  filteredDataSource = [];

  displayedColumns: string[] = ['name', 'building_name', 'tower_name', 'property_name', 'configuration_name', 'min_price', 'bedroom', 'bathroom', 'half_bathroom'];
  dataSource = new MatTableDataSource(this.filteredDataSource);

  @ViewChild('configInput', { static: false }) configInput: ElementRef<HTMLInputElement>;
  @ViewChild('auto', { static: false }) matAutocomplete: MatAutocomplete;

  constructor(private propertyService: PropertyService) {
    this.filteredConfigs = this.configCtrl.valueChanges.pipe(
      startWith(null),
      map((config: string | null) => config ? this._filter(config) : this.filteredConfigurations.slice()));
  }

  ngOnInit(): void {
    this.getProperties();
  }

  getProperties() {
    this.propertyService.getProperties().subscribe(data => {
      this.configurations = data;
      this.setUniqueConfigurations();
    })
  }

  setUniqueConfigurations() {
    this.configurations.forEach(item => this.uniqueConfigurations.add(item['configuration']['name']));
    this.filteredConfigurations = Array.from(this.uniqueConfigurations);
  }

  filterDataSource() {
    this.filteredDataSource = [];
    this.configurations.forEach(item => {
      if (this.isMatchedSearch(item) && this.isMatchedConfiguration(item) && this.isMatchedMinPrice(item)) {
        this.filteredDataSource.push(item);
      }
    });
    this.dataSource = new MatTableDataSource(this.filteredDataSource);
  }

  isMatchedSearch(item): boolean {
    let searchText = this.propertyCtrl.value;
    if (searchText) {
      searchText = searchText.toLowerCase();
    }
    // Add If required configured name filter --> item.configuration.name.indexOf(searchText) !== -1 
    if (searchText !== '' && (item.name.toLowerCase().indexOf(searchText) !== -1 || item.building.name.toLowerCase().indexOf(searchText) !== -1 || item.building_towers.tower_name.toLowerCase().indexOf(searchText) !== -1 || item.property_type.name.toLowerCase().indexOf(searchText) !== -1)) {
      return true;
    } else {
      return false;
    }
  }

  isMatchedConfiguration(item): boolean {
    if (this.selectedConfigs.length > 0) {
      return (this.selectedConfigs.indexOf(item.configuration.name) !== -1) ? true : false;
    }
    return true;
  }

  isMatchedMinPrice(item): boolean {
    return (item.min_price >= this.minPriceCtrl.value) ? true : false;
  }

  sortData(sort: Sort) {
    const data = this.filteredDataSource.slice();
    if (!sort.active || sort.direction === '') {
      this.filteredDataSource = data;
      this.dataSource = new MatTableDataSource(this.filteredDataSource);
      return;
    }
    this.filteredDataSource = data.sort((a, b) => {
      const isAsc = sort.direction === 'asc';
      switch (sort.active) {
        case 'name': return compare(a.name, b.name, isAsc);
        case 'building_name': return compare(a.building.name, b.building.name, isAsc);
        case 'tower_name': return compare(a.building_towers.tower_name, b.building_towers.tower_name, isAsc);
        case 'property_name': return compare(a.property_type.name, b.property_type.name, isAsc);
        case 'configuration_name': return compare(a.configuration.name, b.configuration.name, isAsc);
        case 'min_price': return compare(a.min_price, b.min_price, isAsc);
        case 'bedroom': return compare(a.bedroom, b.bedroom, isAsc);
        case 'bathroom': return compare(a.bathroom, b.bathroom, isAsc);
        case 'half_bathroom': return compare(a.half_bathroom, b.half_bathroom, isAsc);
        default: return 0;
      }
    });
    this.dataSource = new MatTableDataSource(this.filteredDataSource);
  }

  applyFilter(event: Event) {
    this.filterDataSource();
  }

  minPriceProperty(value) {
    (value < 0) ? this.minPriceCtrl.setValue(0) : '';
    this.filterDataSource();
  }

  remove(config) {
    this.selectedConfigs.splice(this.selectedConfigs.indexOf(config), 1);
    this.filteredConfigurations.push(config);
    this.filterDataSource();
    this.configCtrl.setValue(null);
  }

  add(event: MatChipInputEvent): void {
    if (!this.matAutocomplete.isOpen) {
      const input = event.input;
      const value = event.value;
      if ((value || '').trim() && this.uniqueConfigurations.has(value)) {
        this.selectedConfigs.push(value.trim());
        this.filteredConfigurations = this.filteredConfigurations.filter(item => item !== value);
      }
      if (input) {
        input.value = '';
      }
      this.configCtrl.setValue(null);
    }
  }

  selected(event: MatAutocompleteSelectedEvent): void {
    this.selectedConfigs.push(event.option.viewValue);
    this.filteredConfigurations = this.filteredConfigurations.filter(item => item !== event.option.viewValue);
    this.filterDataSource();
    this.configInput.nativeElement.value = '';
    this.configCtrl.setValue(null);
  }

  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();
    return this.filteredConfigurations.filter(config => config.toLowerCase().indexOf(filterValue) === 0);
  }
}

function compare(a: number | string, b: number | string, isAsc: boolean) {
  return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
}
