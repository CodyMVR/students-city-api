<?php

// src/EventListener/CorsSubscriber.php
namespace App\EventListener;

use Symfony\Component\HttpKernel\Event\ResponseEvent;
use Symfony\Component\EventDispatcher\EventSubscriberInterface;

class CorsSubscriber implements EventSubscriberInterface {
    public static function getSubscribedEvents(): array {
        return [ResponseEvent::class => 'onResponse'];
    }

    public function onResponse(ResponseEvent $event): void {
        $r = $event->getRequest();
        if (strpos($r->getPathInfo(), '/api/') !== 0) return;
        $response = $event->getResponse();
        $response->headers
            ->set('Access-Control-Allow-Origin', $r->headers->get('Origin') ?: '*');
        $response->headers->set('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');
        $response->headers->set('Access-Control-Allow-Headers', 'Content-Type,Authorization');
    }
}
