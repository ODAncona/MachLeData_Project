@startuml
start

:Préparation des données initiales;
:Entraînement du modèle initial;

if (Modèle existant ?) then (Non)
    :Sauvegarde du modèle dans le registre;
    :Déploiement du modèle en production;
else (Oui)
    :Comparer le nouveau modèle avec le modèle existant;
    if (Nouveau modèle meilleur ?) then (Oui)
        :Sauvegarde du modèle dans le registre;
        :Déploiement du nouveau modèle en production;
    else (Non)
        :Sauvegarde du modèle dans le registre sans déploiement;
    endif
endif

:Processus opérationnel;

while (Interaction utilisateur) is (Vrai)
    :L'utilisateur effectue une action;

    if (Action == Authentification) then (Oui)
        :L'utilisateur tente de s'authentifier;
        :Le modèle prédit l'identité de l'utilisateur;
        :Retourner le résultat de l'authentification;
    else (Non)
        if (Action == Nouvel utilisateur) then (Oui)
            :Collecte des données du nouvel utilisateur;
            :Mise à jour du dataset avec les nouvelles données;
            :Réentraînement du modèle;

            :Sauvegarde du nouveau modèle dans le registre;
            :Déploiement automatique du nouveau modèle en production;
        else (Action == Suppression utilisateur)
            :Suppression des données de l'utilisateur du dataset;
            :Réentraînement du modèle;

            :Comparer le nouveau modèle avec le modèle existant;
            if (Nouveau modèle meilleur ?) then (Oui)
                :Sauvegarde du modèle dans le registre;
                :Déploiement du nouveau modèle en production;
            else (Non)
                :Sauvegarde du modèle dans le registre sans déploiement;
            endif
        endif
    endif

    :Retour au processus opérationnel;
endwhile

stop
@enduml
