<?php
namespace App\Form;

use App\Entity\Place;
use Symfony\Component\Form\AbstractType;
use Symfony\Component\Form\Extension\Core\Type\ChoiceType;
use Symfony\Component\Form\Extension\Core\Type\TextType;
use Symfony\Component\Form\Extension\Core\Type\TextareaType;
use Symfony\Component\Form\Extension\Core\Type\NumberType;
use Symfony\Component\Form\FormBuilderInterface;
use Symfony\Component\OptionsResolver\OptionsResolver;

class PlaceType extends AbstractType
{
    public function buildForm(FormBuilderInterface $builder, array $options): void
    {
        $builder
            ->add('name', TextType::class, [
                'required' => true,
            ])
            ->add('type', ChoiceType::class, [
                'label' => 'Type',
                'choices' => [
                    'Restaurant'   => 'Restaurant',
                    'Café'         => 'Café',
                    'Bibliothèque' => 'Bibliothèque',
                ],
                'placeholder' => 'Sélectionner un type',
                'required'    => true,
                'empty_data'  => 'Restaurant',
            ])
            ->add('description', TextareaType::class, [
                'required' => true,
            ])
            // On attend maintenant directement 'adresse' dans le JSON
            ->add('adresse', TextType::class, [
                'label'    => 'Adresse',
                'required' => true,
            ])
            ->add('latitude', NumberType::class, [
                'label'    => 'Latitude',
                'required' => true,
            ])
            ->add('longitude', NumberType::class, [
                'label'    => 'Longitude',
                'required' => true,
            ]);
    }

    public function configureOptions(OptionsResolver $resolver): void
    {
        $resolver->setDefaults([
            'data_class'         => Place::class,
            'csrf_protection'    => false,
            'allow_extra_fields' => true,
        ]);
    }
}
