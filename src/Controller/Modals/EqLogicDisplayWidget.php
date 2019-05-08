<?php

/* This file is part of NextDom Software.
 *
 * NextDom is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * NextDom Software is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with NextDom Software. If not, see <http://www.gnu.org/licenses/>.
 *
 * @Support <https://www.nextdom.org>
 * @Email   <admin@nextdom.org>
 * @Authors/Contributors: Sylvaner, Byackee, cyrilphoenix71, ColonelMoutarde, edgd1er, slobberbone, Astral0, DanoneKiD
 */

namespace NextDom\Controller\Modals;

use NextDom\Exceptions\CoreException;
use NextDom\Helpers\Render;
use NextDom\Helpers\Utils;
use NextDom\Managers\CacheManager;
use NextDom\Managers\EqLogicManager;
use NextDom\Managers\UserManager;

class EqLogicDisplayWidget extends BaseAbstractModal
{
    /**
     *
     * @return string
     * @throws CoreException
     * @throws \ReflectionException
     */
    public static function get(): string
    {
        $pageData = [];

        $eqLogicId = Utils::init('eqLogic_id');
        $eqLogic = EqLogicManager::byId($eqLogicId);
        $version = Utils::init('version', 'dashboard');
        if (!is_object($eqLogic)) {
            throw new CoreException(__('EqLogic non trouvé : ') . $eqLogicId);
        }
        $mc = CacheManager::byKey('widgetHtml' . $eqLogic->getId() . $version . UserManager::getStoredUser()->getId());
        if ($mc->getValue() != '') {
            $mc->remove();
        }
        $pageData['eqLogicHtml'] = $eqLogic->toHtml($version);

        return Render::getInstance()->get('/modals/eqLogic.displayWidget.html.twig', $pageData);
    }

}