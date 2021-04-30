
import { Component } from '@angular/core';
import { AlertController,ToastController,ActionSheetController } from '@ionic/angular';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
tarefas: any[] = [];
  constructor(
    private alertCtrl: AlertController,
    private toastCtrl: ToastController,
    private actionSheetCtrl: ActionSheetController
  ) {
    const tasksJson = localStorage.getItem('taskDb');
    if (tasksJson != null) {
      this.tarefas = JSON.parse(tasksJson);
    }
  }
  async showAdd() {
    const alert = await this.alertCtrl.create({
      header: 'O que deseja fazer?',
      inputs: [
        {
          name: 'task',
          type: 'text',
          placeholder: 'Comprar Produto?',
        },
      ],
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          cssClass: 'secondary',
          handler: () => {
            console.log('Confirmar Cancelamento');
          },
        },
        {
          text: 'Adicionar',
          handler: (form) => {
            console.log(form);
            this.add(form.task);
          },
        },
      ],
    });
    await alert.present();
  }

  async add(tarefa: string) {
    //trim - remove os espaços vazios
    if (tarefa.trim().length < 1) {
      const toast = await this.toastCtrl.create({
        message: 'Informa o que deseja fazer:',
        duration: 2000,
        position: 'top',
      });
      toast.present();
      return;
    }
    const tarefas = { name: tarefa, done: false };
    this.tarefas.push(tarefas);
  }

  async abrirAcoes(tarefa: any) {
    const actionSheet = await this.actionSheetCtrl.create({
      header: ' O QUE DESEJA FAZER?',
      buttons: [
        {
          text: tarefa.done ? 'Desmarcar' : 'Marcar',
          icon: tarefa.done ? 'radio-button-off' : 'checkmark-circle-outline',
          handler: () => {
            tarefa.done = !tarefa.done;
            this.updateLocalStorage();
          },
        },
        {
          text: 'Cancelar',
          icon: 'close',
          role: 'cancel',
          handler: () => {
            console.log('Cancelar ação ');
          },
        },
      ],
    });
    await actionSheet.present();
  }
  updateLocalStorage() {
    localStorage.setItem('taskDb', JSON.stringify(this.tarefas));
  }
  delete(tarefa: any) {
    this.tarefas = this.tarefas.filter((tarefaArray) => tarefa !== tarefaArray);
    this.updateLocalStorage();
  }
}
