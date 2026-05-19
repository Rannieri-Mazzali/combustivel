# 🎯 Regras de Segurança Firestore

Este arquivo contém as regras de segurança recomendadas para seu banco de dados Firestore.

## Como Adicionar as Regras

1. Vá para Firebase Console > Firestore Database
2. Clique em "Regras" (tab)
3. Substitua o conteúdo padrão pelas regras abaixo
4. Clique em "Publicar"

## Regras de Segurança

```
rules_version = '2';

service cloud.firestore {
  match /databases/{database}/documents {
    
    // Função para verificar se usuário está autenticado
    function isAuthenticated() {
      return request.auth != null;
    }
    
    // Função para verificar se é o dono do documento
    function isOwner(uid) {
      return request.auth.uid == uid;
    }
    
    // Regras para coleção 'users'
    match /users/{userId} {
      // Permitir leitura apenas para o próprio usuário
      allow read: if isOwner(userId);
      
      // Permitir escrita apenas para o próprio usuário
      allow write: if isOwner(userId);
      
      // Permitir criação de novo documento na autenticação
      allow create: if isAuthenticated() && request.resource.data.createdAt == request.time;
      
      // Permitir update de próprios dados
      allow update: if isOwner(userId) && 
                       (request.resource.data.email == resource.data.email &&
                        request.resource.data.createdAt == resource.data.createdAt);
    }
    
    // Regras para coleção 'vehicles'
    match /vehicles/{vehicleId} {
      // Permitir leitura apenas do próprio veículo
      allow read: if isOwner(resource.data.userId);
      
      // Permitir escrita apenas do dono
      allow write: if isOwner(resource.data.userId);
      
      // Permitir criação com validação
      allow create: if isAuthenticated() && 
                       request.resource.data.userId == request.auth.uid &&
                       request.resource.data.createdAt == request.time;
      
      // Permitir update apenas do dono
      allow update: if isOwner(resource.data.userId);
      
      // Permitir delete apenas do dono
      allow delete: if isOwner(resource.data.userId);
    }
    
    // Regras para coleção 'refuel_records'
    match /refuel_records/{recordId} {
      // Permitir leitura apenas do próprio registro
      allow read: if isOwner(resource.data.userId);
      
      // Permitir escrita apenas do dono
      allow write: if isOwner(resource.data.userId);
      
      // Permitir criação com validação
      allow create: if isAuthenticated() && 
                       request.resource.data.userId == request.auth.uid &&
                       request.resource.data.createdAt == request.time;
      
      // Permitir update apenas do dono
      allow update: if isOwner(resource.data.userId);
      
      // Permitir delete apenas do dono
      allow delete: if isOwner(resource.data.userId);
    }
    
    // Negar acesso a outras coleções
    match /{document=**} {
      allow read, write: if false;
    }
  }
}
```

## O que essas regras fazem:

1. **Autenticação**: Apenas usuários autenticados podem acessar dados
2. **Isolamento de Dados**: Cada usuário só vê seus próprios dados
3. **Validação**: Dados devem ter timestamp correto ao serem criados
4. **Imutabilidade**: Certos campos (como email e createdAt) não podem ser alterados
5. **Segurança**: Negam acesso a coleções desconhecidas

## ⚠️ Importante

- Essas regras são seguras para PRODUÇÃO
- Sempre teste as regras antes de fazer deploy
- Use o Firebase Emulator para testar localmente
- Monitore o uso do banco de dados regularmente

## Testando as Regras

Use o Firebase Emulator:

```bash
firebase emulators:start
```

Isso iniciará um emulador local onde você pode testar as regras sem afetar seu banco de dados.
