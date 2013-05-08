using UnityEngine;
using System.Collections;

public class BaseHealthCS : MonoBehaviour {

  public float hpMax = 0;
  public float hpCurrent;

  public float shieldHPMax = 0;
  public float shieldHPCurrent;

  public float shieldRegenRate = 1;
  public float shieldRegenDelay = 1;
  public float shieldRegenCountdown;

  public BaseHealthBarCS healthBar;

  public bool bDebug;
    
	// Use this for initialization
	public virtual void Start () {
    hpCurrent = hpMax;
    shieldHPCurrent = shieldHPMax;

    if (healthBar == null)
    {
      healthBar = (BaseHealthBarCS) GetComponent(typeof(BaseHealthBarCS));
    }

    UpdateHealthBar();
	}
	
	// Update is called once per frame
	public virtual void Update () 
  {
      if (shieldHPCurrent < shieldHPMax)
      {
          if (shieldRegenCountdown > 0)
          {
              shieldRegenCountdown -= Time.deltaTime;
          }
          else
          {
              shieldHPCurrent = Mathf.Clamp(shieldHPCurrent + (shieldRegenRate * Time.deltaTime), 0, shieldHPMax);
              UpdateHealthBar();
          }
      }
  }

  public void ReceiveDamage(float fDamage)
  {
      //Put this If in place in case I want to have something later on that knocks shield regen out longer...
      if(shieldRegenCountdown < shieldRegenDelay) shieldRegenCountdown = shieldRegenDelay;

      if (shieldHPCurrent > 0)
      {
          if (shieldHPCurrent > fDamage)
          {
              shieldHPCurrent -= fDamage;
          }
          else
          {
              hpCurrent -= (fDamage - shieldHPCurrent);
              shieldHPCurrent = 0;
          }
      }
      else
      {
          hpCurrent -= fDamage;
      }

      if (hpCurrent <= 0)
      {
          Destroy(this.gameObject);
      }
      else
      {
          UpdateHealthBar();
      }
  }

  public virtual void UpdateHealthBar()
  {
    if (healthBar != null)
    {
      //whee, going to get to find out how much of this doesn't work anymore soon!
      healthBar.shieldhpratio = shieldHPCurrent / shieldHPMax;
      healthBar.hpratio = hpCurrent/ hpMax;
      healthBar.bShowShields = (shieldHPCurrent> 0);
    }
  }

}
