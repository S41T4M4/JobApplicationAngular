import { AlertsComponent } from './../../alerts/alerts.component';
import { Component, OnInit , ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from './../../../auth.service';
import { Vaga } from './../../../vaga.model';
import { AlertComponent } from '@coreui/angular';
import { salaryRangeValidator } from '../../../custom-validators';

@Component({
  selector: 'app-management-jobs',
  templateUrl: './management-jobs.component.html',
  styleUrls: ['./management-jobs.component.css']
})
export class ManagementJobsComponent implements OnInit {
  @ViewChild(AlertComponent) alertComponent!: AlertsComponent;
  vagas: Vaga[] = [];
  isLoading: boolean = true;
  id_recrutador: number = 0;
  error: Error | null = null
  vagaForm!: FormGroup;
  erro = '';
  requiredTitulo = 'O campo de titulo é obrigatorio !!'
  requiredDescription = 'O campo de descrição é obrigatorio !!';
  requiredRequisitos='O campo de requisitos é obrigatorio ';
  requiredSalario = 'O salário tem que ser maior que R$500 ou menor que R$100000';
  requiredLocal = 'O campo de local é obrigatorio !!';
  requiredStatus = 'O campo de status é obrigatorio !!'
  isDisabled = false;
  formatIncorrectMessage = '';
  formatFieldsRequired = 'É necessario preencher todos os campos'
  isSubmitted = false;
  isHidden= false;
  constructor(private authService: AuthService, private fb: FormBuilder) {}

  ngOnInit(): void {
    this.id_recrutador = Number(localStorage.getItem('id'));
    this.initializeForm();
    console.log(this.id_recrutador)
  }

  initializeForm(): void {
    this.vagaForm = this.fb.group({
      titulo: ['', Validators.required],
      descricao: ['', Validators.required],
      requisitos: ['', Validators.required],
      salario: [500, [Validators.required, salaryRangeValidator(499, 100000)]],
      localizacao: ['', Validators.required],
      status: ['Aberta', Validators.required],
      id_recrutador: [this.id_recrutador]
    });
  }

  get titulo(){
    return this.vagaForm.get('titulo')!;
  }
  get descricao(){
    return this.vagaForm.get('descricao')!;
  }
  get requisitos(){
    return this.vagaForm.get('requisitos')!;
  }
  get salario():any{
    return this.vagaForm.get('salario')!;
  }
  get localizacao(){
    return this.vagaForm.get('titulo')!;
  }
  get status(){
    return this.vagaForm.get('status')!;
  }


//

  addVaga(): void {
     this.isSubmitted = true;
    if (this.vagaForm.valid) {
      console.log('Dados da Vaga:', this.vagaForm.value);
      this.authService.postVagas(this.vagaForm.value).subscribe(
        () => {
      //    this.loadVagas();
          this.vagaForm.reset();
          this.isSubmitted = false;
        },
        (error) => {
          if(error.status === 400){
            this.isSubmitted = true;
            this.formatIncorrectMessage = 'Nem todos os dados foram preenchidos'
            console.log('Erro 400 ao cadastrar vaga:', error.error);
          }
           this.isSubmitted = true;
          this.formatIncorrectMessage = 'Nem todos os dados foram preenchidos corretamente !'
          console.error('Erro inesperado ' , error);
        }
      );
    }
  }
}
